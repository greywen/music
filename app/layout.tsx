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
        <link rel='apple-touch-icon' href='/icon.png' />
        <link rel='shortcut icon' href='/icon.png' />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
