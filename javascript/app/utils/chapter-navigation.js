function addToc() {
  const $chapters = $('#toc-chapters');
  const $currentChapter = $('#toc');

  $chapters.toc({
    container: '.nav',
    selectors: 'h1',
    highlightOnScroll: false,
    smoothScrolling: false,
    anchorName(i, heading) {
      return $(heading)
        .text()
        .replace('/chapters/', '');
    },
  });

  $currentChapter.toc({
    container: '.chapter',
    selectors: 'h1, h2',
    highlightOnScroll: true,
  });
}

function handleChapterToggle() {
  const $navContainer = $('.subnav');
  const $toggleHandlers = $('.chapter-toggle, .chapter-nav__listing ul li a');
  const $chaptersContainer = $('.chapter-nav__listing');
  const $chapters = $chaptersContainer.find('li').toArray();
  const $currentChapterContainer = $('.subnav__chapters-container');
  const chapterNumber = $currentChapterContainer.find('.chapter-number').text();

  const navContainerTopPadding = '8rem';
  const navContainerLeftPadding = '3.1rem';
  const chapterTransformY = 30;
  const singleChapterAnimationDuration = 200;
  const currentChapterAnimationDuration = 600;
  const moveCurrentChapterAnimationDuration = 300;

  const moveCurrentChapter = (isForwardAnimation) => {
    if (!isForwardAnimation) {
      $currentChapterContainer.css({
        top: navContainerTopPadding,
        left: 'initial',
        marginLeft: 0,
        width: '100%',
      });
      return setTimeout(() => $currentChapterContainer.css('position', 'static'), moveCurrentChapterAnimationDuration);
    }

    $currentChapterContainer.css({
      position: 'absolute',
      left: 0,
      marginLeft: navContainerLeftPadding,
      width: `calc(100% - ${navContainerLeftPadding} - 15px`,
    });
    const chapterPositionInNav = $chapters.reduce((prevValue, chapter) => {
      if ($(chapter).find('.chapter-number').text() === chapterNumber) {
        return $(chapter).position().top - chapterTransformY;
      }
      return prevValue;
    }, null);
    return $currentChapterContainer.css('top', chapterPositionInNav);
  };

  $toggleHandlers.click(() => {
    if ($navContainer.hasClass('animating')) return;

    const chaptersWithoutCurrent = $chapters.filter(chapter => (
      $(chapter).find('.chapter-number').text() !== chapterNumber
    ));
    const isForwardAnimation = $currentChapterContainer.hasClass('subnav__chapters-container--active');

    const currentChapterAnimationDelay = isForwardAnimation ? 0 :
      singleChapterAnimationDuration + moveCurrentChapterAnimationDuration;
    const moveAnimationDelay = isForwardAnimation ? currentChapterAnimationDuration : 0;
    const paddingAnimationDelay = isForwardAnimation ? currentChapterAnimationDuration : singleChapterAnimationDuration;
    const chaptersAnimationDelay = isForwardAnimation ?
      currentChapterAnimationDuration + moveCurrentChapterAnimationDuration : 0;

    $navContainer.addClass('animating');
    setTimeout(() => {
      $currentChapterContainer.toggleClass('subnav__chapters-container--active');
      setTimeout(() => {
        $chaptersContainer.toggleClass('chapter-nav__listing--active');
      }, currentChapterAnimationDuration);
      setTimeout(() => {
        $navContainer.toggleClass('subnav--small-padding');
      }, paddingAnimationDelay);
      setTimeout(() => {
        moveCurrentChapter(isForwardAnimation);
      }, moveAnimationDelay);
    }, currentChapterAnimationDelay);

    setTimeout(() => {
      if (!isForwardAnimation) {
        $(chaptersWithoutCurrent).removeClass('visible');
        $navContainer.removeClass('animating');
      } else {
        chaptersWithoutCurrent.map((chapter, index, array) => (
          setTimeout(() => {
            $(chapter).addClass('visible');
            if (index === array.length - 1) {
              $navContainer.removeClass('animating');
            }
          }, index * singleChapterAnimationDuration)
        ));
      }
    }, chaptersAnimationDelay);
  });
}

export default function () {
  addToc();
  handleChapterToggle();
}
