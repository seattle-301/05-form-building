// Configure a view object, to hold all our functions for dynamic updates and article-related event handlers.
var articleView = {};

articleView.render = function() {
  articles.forEach(function(a) {
    $('#articles').append(a.toHtml('#article-template'));
    $('#author-filter').append(a.toHtml('#author-filter-template'));
    if($('#category-filter option:contains("'+ a.category + '")').length === 0) {
      $('#category-filter').append(a.toHtml('#category-filter-template'));
    };
  });
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
};

articleView.handleAuthorFilter = function() {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-author="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = function() {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-category="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = function() {
  $('.main-nav').on('click', '.tab', function(e) {
    $('.tab-content').hide();
    $('#' + $(this).data('content')).fadeIn();
  });
  $('.main-nav .tab:first').click();
};

articleView.setTeasers = function() {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

articleView.initNewArticlePage = function() {
  // TODO: The new articles we create need transferring into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we
  // have data to export. Also, let's add a focus event to help us select the JSON.
  $('#export-field').hide();
  $('#article-json').on('focus', function() {
    $(this).select();
  });
  // TODO: Add an event handler to update the preview and the export field if any inputs change.
  $('#new-form').on('change', articleView.create);
};

articleView.create = function() {
  // TODO: Clear out our preview, to be replaced by the updated preview
  $('#article-preview').empty().fadeIn();
  // TODO: Instantiate an Article based on what's in the form fields:
  var formArticle = new Article({
    title: $('#article-title').val(),
    body: $('#article-body').val(),
    author: $('#article-author').val(),
    authorUrl: $('#article-author-url').val(),
    category: $('#article-category').val(),
    publishedOn: $('#article-published:checked').length ? new Date() : null
  });
  /* TODO: Use our own interface to the Handblebars template
          to put this new article into the DOM: */
  $('#article-preview').append(formArticle.toHtml('#article-template'));
  /* TODO: Activate the highlighting of any code blocks
          - Triple backtics example:
  ```
  function coolStory() {
    return 'Hooray! Code highlighting!';
  };
  ```

  */
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
  // TODO: Export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
  $('#export-field').fadeIn();
  $('#article-json').val(JSON.stringify(formArticle));
};

articleView.render();
articleView.initNewArticlePage();
articleView.handleCategoryFilter();
articleView.handleAuthorFilter();
articleView.handleMainNav();
articleView.setTeasers();
