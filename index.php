<!DOCTYPE html>
<html>
  <head>
    <title>RENDER</title>
	  <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
    <script type='text/javascript' src='build/inflate.min.js'></script>
    <script type='text/javascript' src='build/app.min.js'></script>
    <link rel='stylesheet' href='build/style.min.css'>
    <script type='text/css'>
      @font-face {
        font-family: 'Karla';
        src: url('fonts/Karla-Regular.ttf') format('truetype');
      }
    </script>
  </head>
  <body>
    <div id='loading-screen' class='loading-screen'>
      <div class='loading-screen__inner'>Loading...</div>
    </div>

    <div class='wrapper'>
      <div id='canvas-target' class='canvas-wrapper'></div>
      <div class='title'></div>
      <div class='landing-pane'>
        <div class='landing-pane__inner'>
          <div class='landing-pane__title'></div>
          <div class='landing-pane__dismiss'></div>
        </div>
      </div>

      <div class='nav'>
        <div class='nav__item' data-page='index'>index</div>
        <div class='nav__item' data-page='work'>work</div>
        <div class='nav__item' data-page='contact'>contact</div>
      </div>

      <div id='overlay' class='overlay'>
        <!-- 3d items load here -->
      </div>
    </div>
  </body>
</html>
