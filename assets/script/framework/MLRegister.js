
export default new class gameEntry {
    constructor()
    {
        window.ML = this;
    }

    regisiterModule(module){
        this[module.moduleName] = module;
    }
}
