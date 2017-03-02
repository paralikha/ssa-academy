(function ($, document, window) {

    'use strict';

    $(document).ready(function (e) {
        ///////////
        // Inits //
        ///////////

        ///////////////
        // Functions //
        ///////////////
        $(document).find('[data-img]').each(function (e) {
            $(this).css({ 'background-img': $(this).data('img') });
        });

    });

})(jQuery, document, window);