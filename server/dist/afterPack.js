exports.defaults = {
  afterPack: async (params) => {
    let currentExecutable = params.options.productName,
        appName = params.options.productName + ".app",
        oldExecutable = path.join(params.appOutDir, appName, "Contents", "MacOS", "Electron");
    return fs.symlinkAsync(currentExecutable, oldExecutable);
  }
}