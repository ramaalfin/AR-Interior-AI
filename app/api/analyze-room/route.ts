import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google API key not configured' },
        { status: 500 }
      );
    }

    console.log('Sending request to Gemini API...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this room image and provide:
1. A brief room description (2-3 sentences)
2. Detected interior style (e.g., modern, minimalist, scandinavian, industrial, etc.)
3. Color palette (list 3-4 main colors)
4. Recommended furniture categories needed (list: seating, dining, storage, lighting, accessories)

Format your response as JSON with these exact keys:
{
  "description": "...",
  "style": "...",
  "colors": ["color1", "color2", "color3"],
  "categories": ["category1", "category2", "category3"]
}

IMPORTANT: Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text.`,
                },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 8192, // Tambah batas token output
            temperature: 0.4, // Kurangi temperature untuk respons lebih konsisten
            topP: 0.8,
            topK: 40
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      return NextResponse.json(
        { error: 'Failed to analyze room' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Gemini API response received');

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const finishReason = data.candidates?.[0]?.finishReason;

    if (!content) {
      console.error('No content in Gemini response');
      return NextResponse.json(
        { error: 'No analysis generated' },
        { status: 500 }
      );
    }

    // Log finish reason untuk debugging
    if (finishReason === 'MAX_TOKENS') {
      console.warn('Warning: Response truncated due to MAX_TOKENS');
    }

    console.log('Raw content from Gemini:', content);

    // Clean the content - remove markdown code blocks if present
    let cleanedContent = content;

    // Remove markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      cleanedContent = jsonMatch[1].trim();
      console.log('Extracted JSON from code block:', cleanedContent);
    }

    // Try to find JSON object in the content
    const jsonObjectMatch = cleanedContent.match(/\{[\s\S]*\}/);
    if (!jsonObjectMatch) {
      console.error('No JSON object found in content:', cleanedContent);
      return NextResponse.json(
        { error: 'Failed to parse analysis - invalid response format' },
        { status: 500 }
      );
    }

    const jsonString = jsonObjectMatch[0];

    try {
      const analysis = JSON.parse(jsonString);

      // Validate required fields
      const requiredFields = ['description', 'style', 'colors', 'categories'];
      const missingFields = requiredFields.filter(field => !analysis[field]);

      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        return NextResponse.json(
          { error: 'Analysis missing required fields' },
          { status: 500 }
        );
      }

      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse JSON string:', jsonString);

      return NextResponse.json(
        { error: 'Failed to parse analysis - invalid JSON' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error analyzing room:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}