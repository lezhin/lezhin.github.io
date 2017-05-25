(function (g, d) {
    var t = g.setInterval(function () {
        var w = g.outerWidth - g.innerWidth > 160;
        var h = g.outerHeight - g.innerHeight > 160;
        if (!(w && h) && ((g.Firebug && g.Firebug.chrome && g.Firebug.chrome.isInitialized) || w || h)) {
            console.log('** MAY THE INSPECTOR BE WITH YOU! **\n');
            console.log('feel free to contact us via tech@lezhin.com');
            g.clearInterval(t);
        }
    }, 1000);
})(window, document);
