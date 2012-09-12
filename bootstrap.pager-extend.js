$(function () {
    $('.pagination ul li.prev').click(function (e) {
        pager.showPrev($(this));
    });

    $('.pagination ul li.next').click(function (e) {
        pager.showNext($(this));
    });

    $('.pagination a[data-toggle="tab"]').on('shown', function (e) {
        pager.handleBounds($(e.target).parent('li.active'));
    });

    var pager = {
        showPrev: function ($target) {
            $target.siblings('.active').prev()
                .find('a[data-toggle=tab]').tab('show');
        },
        showNext: function ($target) {
            $target.siblings('.active').next()
                .find('a[data-toggle=tab]').tab('show');
        },
        handleBounds: function ($target) {
            this.limitVisibleTabsAround($target);
            this.togglePrevNextPerActive($target);
        },
        limitVisibleTabsAround: function ($target) {
            var numberToShow = 5; // Best as an odd number
            var numberEachSide = Math.floor(numberToShow / 2);

            var $tabs = $target.siblings('.tab').andSelf();
            var tabCount = $tabs.length;
            if (tabCount <= numberToShow) {
                return; // base case, show all
            }

            var index = $target.index('.tab');
            var leftIndex = index - numberEachSide;
            var rightIndex = index + numberEachSide;

            // Toggle ellipsis buttons
            $target.siblings('li.left-ellipsis')
                .toggle(leftIndex > 0);
            $target.siblings('li.right-ellipsis')
                .toggle(rightIndex < tabCount - 1);

            // If left side is off the edge, show from the far left
            if (leftIndex < 0) {
                leftIndex = 0;
                rightIndex = numberToShow - 1;
            }
            // If right side is off the edge, show from the far right
            if (rightIndex > tabCount - 1) {
                rightIndex = tabCount - 1;
                leftIndex = tabCount - numberToShow;
            }

            // Show and hide appropriate sections
            var $toShow = $tabs.slice(leftIndex, rightIndex + 1).show();
            $tabs.not($toShow).hide();
        },
        togglePrevNextPerActive: function ($target) {
            var $prevLink = $target.siblings('li.prev');
            var $nextLink = $target.siblings('li.next');
            var $prevTarget = $target.prev()
                .find('a[data-toggle=tab]');
            var $nextTarget = $target.next()
                .find('a[data-toggle=tab]');

            // disable prev/next if first or last page selected
            $prevLink.toggleClass('disabled',
                $prevTarget.length === 0);
            $nextLink.toggleClass('disabled',
                $nextTarget.length === 0);
        },
        init: function () {
            $('.pagination li.tab.active').each(function () {
                pager.handleBounds($(this));
            });
        }
    };

    // Initialize visibility and prev/next
    pager.init();
});