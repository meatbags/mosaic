<?php $page = $_GET['page'] ?? 'index'; ?>
<!DOCTYPE html>
<html>
  <head>
    <title>xavier_burrow</title>
	  <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
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
  <body data-initial-page='<?php echo $page; ?>'>
    <div id='loading-screen' class='loading-screen'>
      <div class='loading-screen__inner'>Loading...</div>
      <div class='loading-screen__background'>
        <div></div><div></div><div></div><div></div>
      </div>
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

    <div id='text-container' class='text'>
      <div data-target='index' class='active'>
        <span>Xavier Burrow</span> is an interactive developer based in Sydney, Australia. His work aims to bewilder and delight.
      </div>
      <div data-target='work'>
        <div data-year='2022'><span>2022</span></div>
        <div data-year='2021'><span>2021</span></div>
        <div data-year='2020'><span>2020</span></div>
        <div data-year='2019'><span>2019</span></div>
        <div data-year='2018'><span>2018</span></div>
        <div data-year='2016'><span>2016</span></div>
      </div>
      <div data-target='contact'>
        <span>GET IN TOUCH:</span><br />
        <a href='mailto:jxburrow@gmail.com'>jxburrow@gmail.com</a><br />
        <a href='https://www.instagram.com/xavebabes/' target='_blank'>instagram</a><br />
        <a href='https://github.com/meatbags' target='_blank'>github</a><br />
        <a href='https://getpixel.itch.io/' target='_blank'>itch.io</a>
      </div>
    </div>
  </body>
</html>
