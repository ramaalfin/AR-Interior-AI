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

    const apiKey = process.env.GOOGLE_API_KEY; // Changed from NEXT_PUBLIC_GOOGLE_API_KEY
    if (!apiKey) {
      console.error('Google API key not configured');
      return NextResponse.json(
        { error: 'Google API key not configured' },
        { status: 500 }
      );
    }

    // Remove the data:image/jpeg;base64, prefix if it exists
    const base64Data = imageBase64.includes('base64,')
      ? imageBase64.split('base64,')[1]
      : imageBase64;

    console.log('Sending request to Gemini API...');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, // Using gemini-1.5-flash instead
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

Return ONLY the JSON, no other text.`,
                },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          },
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
        { error: `Gemini API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    // Check if we have a valid response
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in response:', data);
      return NextResponse.json(
        { error: 'No analysis generated - empty response' },
        { status: 500 }
      );
    }

    const content = data.candidates[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error('No content in response:', data.candidates[0]);
      return NextResponse.json(
        { error: 'No analysis generated - missing content' },
        { status: 500 }
      );
    }

    console.log('Raw content from Gemini:', content);

    // Try to extract JSON from the response
    let analysis;
    try {
      // First, try to parse the entire content as JSON
      analysis = JSON.parse(content);
    } catch (e) {
      // If that fails, try to extract JSON from the text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysis = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          console.error('Failed to parse extracted JSON:', jsonMatch[0]);
          throw new Error('Invalid JSON format');
        }
      } else {
        console.error('No JSON found in content:', content);
        throw new Error('No JSON found in response');
      }
    }

    // Validate the analysis has the required fields
    if (!analysis.description || !analysis.style || !analysis.colors || !analysis.categories) {
      console.error('Invalid analysis structure:', analysis);
      return NextResponse.json(
        { error: 'Invalid analysis format' },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing room:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}