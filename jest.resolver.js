// A hack inspired by https://github.com/mswjs/msw/issues/1786#issuecomment-1786122056 since the
// prescribed https://mswjs.io/docs/migrations/1.x-to-2.x#cannot-find-module-mswnode-jsdom
// broke other things

module.exports = (path, options) => {
  // Jest + jsdom acts like a browser (i.e., it looks for "browser" imports
  // under pkg.exports), but msw knows that you're operating in a Node
  // environment:
  //
  // https://github.com/mswjs/msw/issues/1786#issuecomment-1782559851
  //
  // The MSW project's recommended workaround is to disable Jest's
  // customExportConditions completely, so no packages use their browser's
  // versions.  We'll instead clear export conditions only for MSW.
  if (/^(msw|@mswjs\/interceptors)(\/|$)/.test(path)) {
    return options.defaultResolver(
      path,
      {
        ...options,
        packageFilter: (pkg) => {
          if (pkg.name === 'msw') {
            delete pkg.exports['./node'].browser
          }
          if (pkg.name === '@mswjs/interceptors') {
            delete pkg.exports
          }

          return pkg
        },
      })
  }

  return options.defaultResolver(path, options)
}