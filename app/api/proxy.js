import { serialize } from 'cookie';

export async function POST(request) {
  const { username, password, submit } = await request.json();
  const apiURL = 'http://serviceease.techser.com/live/index.php/login';

  const options = {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'host':'serviceease.techser.com',
      'Origin': 'http://serviceease.techser.com',
      'Referer': 'http://serviceease.techser.com/live/',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    },
    body: new URLSearchParams({
      'username': username,
      'password': password,
      'submit': submit,
    })
  };

  try {
    const response = await fetch(apiURL, options);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Network response was not ok: ${response.statusText} - ${errorData}`);
    }

    const cookies = response.headers.get('set-cookie');

    if (!cookies) {
      throw new Error('No cookies found in the response');
    }

    const cookie = serialize('auth', cookies, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return new Response(JSON.stringify({ message: 'Login successful' }), {
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error during authentication:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
