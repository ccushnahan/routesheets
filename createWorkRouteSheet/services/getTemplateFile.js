const os = require("os");
const path = require("path")

module.exports = function getTemplateFile(fileLocation = "projects/routesheets/createWorkRouteSheet/templates/template.xlsx") {
    return path.join(os.homedir(), fileLocation);
}