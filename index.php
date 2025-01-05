<?php $page = $_GET['page'] ?? 'index'; ?>
<!DOCTYPE html>
<html>
  <head>
    <title>xavier_burrow</title>
	  <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <script type='text/javascript' src='build/inflate.min.js'></script>
    <script type='text/javascript' src='build/app.min.js?v=2023'></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Karla&display=swap" rel="stylesheet">
    <link rel='stylesheet' href='build/style.min.css?v=1.20241125.1'>
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
        <div class='nav__item' data-page='work'>creative</div>
        <div class='nav__item' data-page='corpo'>corpo</div>
        <div class='nav__item' data-page='contact'>contact</div>
      </div>

      <div id='overlay' class='overlay'>
        <!-- 3d items load here -->
      </div>
    </div>

    <div id='text-container' class='text'>
      <div data-target='index' class='active'>
        <span>Xavier Burrow</span>
        <br>
        is an interactive developer living and working on Gadigal lands/Sydney, Australia.
        His work immerses the user in novel spaces and experiences, aiming to
        <div class='fade'>
          <div class='fade__item'>bewilder, </div>
          <div class='fade__item'>delight, </div>
          <div class='fade__item'>annoy, </div>
          <div class='fade__item'>transport, </div>
          <div class='fade__item'>arouse, </div>
          <div class='fade__item'>uplift, </div>
          <div class='fade__item'>downplay, </div>
          <div class='fade__item'>enrage, </div>
          <div class='fade__item'>attack, </div>
          <div class='fade__item'>blaspheme, </div>
          <div class='fade__item'>sexualise, </div>
          <div class='fade__item'>pretend, </div>
          <div class='fade__item'>bungle, </div>
          <div class='fade__item'>encode, </div>
          <div class='fade__item'>be barely visible </div>
        </div>
      </div>
      <div data-target='work'>
        <span>Select creative</span>
        <br>
        <div data-group='games'><span>games</span></div>
        <div data-group='web'><span>web/virtual</span></div>
        <div data-group='video'><span>video</span></div>
      </div>
      <div data-target='corpo'>
        <span>Select corporate</span>
        <br>
        <div data-group='saas'><span>saas</span></div>
        <div data-group='website'><span>website</span></div>
      </div>
      <div data-target='contact'>
        <span>Contact</span>
        <br>
        <div class='heading'>email</div>
        <a href='mailto:jxburrow@gmail.com'>jxburrow@gmail.com</a><br />
        <div class='heading'>dev links</div>
        <a href='https://github.com/meatbags' target='_blank'>github</a><br />
        <a href='https://getpixel.itch.io/' target='_blank'>itch.io</a><br />
        <div class='heading'>social</div>
        <a href='https://www.instagram.com/xavebabes/' target='_blank'>instagram</a><br />
      </div>
    </div>
  </body>
</html>
