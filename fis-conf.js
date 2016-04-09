fis.match('*.html', {
    useMap: true
});

fis.match('*.less', {
  parser: fis.plugin('less'),
  rExt: '.css'
});

//开启同名依赖
fis.match('static/**', {
    useSameNameRequire: true
});

fis.hook('commonjs');

fis.match('static/**.js', {
  isMod: true
});

fis.match('static/lib/**.js', {
  isMod: false
});

fis.media('prod').match('**',{
  release:'wx/$0'
});


fis.match('::package', {
    postpackager: fis.plugin('loader', {
    	sourceMap: true,
    	useInlineMap: true
    })
})



