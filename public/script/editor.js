var body = $('#blogBody').val();
$(document).ready(function() {
    $('#body').summernote({
        toolbar: [
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['font', ['fontname', 'strikethrough', 'superscript', 'subscript', 'bold', 'italic', 'underline', 'strikethrough', ]],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
          ['table', ['table']],
          ['insert', ['link', 'picture', 'video', 'hr']],
          ['view', ['fullscreen', 'codeview', 'undo', 'redo', 'help']],
        ],
        'width': 600,
        'height': 600
      }).summernote('pasteHTML', body?body:"");
  });