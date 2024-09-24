import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8'></meta>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        ></meta>

        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link
          rel='manifest'
          href='/manifest.json'
          crossOrigin='use-credentials'
        />
        <link rel='apple-touch-icon' href='/icon.png' />
        <link rel='shortcut icon' href='/icon.png' />
      </head>
      <body>
        {children}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var lastTouchEnd = 0;
                document.addEventListener('touchend', function(event) {
                  var now = (new Date()).getTime();
                  if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                  }
                  lastTouchEnd = now;
                }, false);
                document.addEventListener('gesturestart', function(event) {
                  event.preventDefault();
                });
              })();
              `,
          }}
        ></script>
      </body>
    </html>
  );
}
