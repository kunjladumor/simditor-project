(function () {
  $(function () {
    var $preview, editor, mobileToolbar, toolbar;
    Simditor.locale = "en-US";
    toolbar = [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "fontScale",
      "color",
      "link",
      "emoji",
      "ol",
      "ul",
      "image",
      "alignment",
      "unsplash",
    ];

    mobileToolbar = ["bold", "underline", "strikethrough", "color", "ul", "ol"];
    if (mobilecheck()) {
      toolbar = mobileToolbar;
    }
    editor = new Simditor({
      textarea: $("#txt-content"),
      placeholder: "Your text goes here...",
      toolbar: toolbar,
      pasteImage: true,
      defaultImage: "assets/images/image.png",
      upload: {
        url: "/shared/uploadpostimages",
        params: {
          pTopicId: 1,
        },
        fileKey: "upload_file",
        connectionCount: 1,
        leaveConfirm:
          "Uploading is in progress, are you sure to leave this page?",
      },
    });
    $preview = $("#preview");
    if ($preview.length > 0) {
      return editor.on("valuechanged", function (e) {
        return $preview.html(editor.getValue());
      });
    }
  });
}).call(this);
