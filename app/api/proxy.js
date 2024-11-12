export async function POST() {
  var url = 'http://serviceease.techser.com/live/index.php/login';
  var options = {
    'method': 'post',
    'followRedirects': false,
    'headers': {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'http://serviceease.techser.com',
      'Referer': 'http://serviceease.techser.com/live/',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
    },
    'payload': {
      'username': 'admin',  
      'password': 'password',
      'submit' : '',   
    }
  };

  var response = UrlFetchApp.fetch(url, options);
  var cookies = response.getHeaders()['Set-Cookie'];
  return cookies;
}