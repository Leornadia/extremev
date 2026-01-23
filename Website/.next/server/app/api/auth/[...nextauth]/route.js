"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Falmeidajose%2FDocuments%2FA%2FApp%2FExtreme%20V%2FWebsite%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Falmeidajose%2FDocuments%2FA%2FApp%2FExtreme%20V%2FWebsite&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Falmeidajose%2FDocuments%2FA%2FApp%2FExtreme%20V%2FWebsite%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Falmeidajose%2FDocuments%2FA%2FApp%2FExtreme%20V%2FWebsite&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_almeidajose_Documents_A_App_Extreme_V_Website_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"/Users/almeidajose/Documents/A/App/Extreme V/Website/app/api/auth/[...nextauth]/route.ts\",\n    nextConfigOutput,\n    userland: _Users_almeidajose_Documents_A_App_Extreme_V_Website_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmFsbWVpZGFqb3NlJTJGRG9jdW1lbnRzJTJGQSUyRkFwcCUyRkV4dHJlbWUlMjBWJTJGV2Vic2l0ZSUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZhbG1laWRham9zZSUyRkRvY3VtZW50cyUyRkElMkZBcHAlMkZFeHRyZW1lJTIwViUyRldlYnNpdGUmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ3dDO0FBQ3JIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2Vic2l0ZS8/OWM5ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvYWxtZWlkYWpvc2UvRG9jdW1lbnRzL0EvQXBwL0V4dHJlbWUgVi9XZWJzaXRlL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoL1suLi5uZXh0YXV0aF1cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9hbG1laWRham9zZS9Eb2N1bWVudHMvQS9BcHAvRXh0cmVtZSBWL1dlYnNpdGUvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Falmeidajose%2FDocuments%2FA%2FApp%2FExtreme%20V%2FWebsite%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Falmeidajose%2FDocuments%2FA%2FApp%2FExtreme%20V%2FWebsite&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(_lib_auth__WEBPACK_IMPORTED_MODULE_1__.authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFpQztBQUNRO0FBRXpDLE1BQU1FLFVBQVVGLGdEQUFRQSxDQUFDQyxrREFBV0E7QUFFTyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnNpdGUvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cz9jOGE0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBOZXh0QXV0aCBmcm9tICduZXh0LWF1dGgnO1xuaW1wb3J0IHsgYXV0aE9wdGlvbnMgfSBmcm9tICdAL2xpYi9hdXRoJztcblxuY29uc3QgaGFuZGxlciA9IE5leHRBdXRoKGF1dGhPcHRpb25zKTtcblxuZXhwb3J0IHsgaGFuZGxlciBhcyBHRVQsIGhhbmRsZXIgYXMgUE9TVCB9OyJdLCJuYW1lcyI6WyJOZXh0QXV0aCIsImF1dGhPcHRpb25zIiwiaGFuZGxlciIsIkdFVCIsIlBPU1QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/google */ \"(rsc)/./node_modules/next-auth/providers/google.js\");\n/* harmony import */ var next_auth_providers_facebook__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/providers/facebook */ \"(rsc)/./node_modules/next-auth/providers/facebook.js\");\n/* harmony import */ var _next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @next-auth/prisma-adapter */ \"(rsc)/./node_modules/@next-auth/prisma-adapter/dist/index.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n\n\n\n\n\n\n// Mock users for demonstration (when database is not available)\nconst mockUsers = [\n    {\n        id: \"1\",\n        email: \"demo@extremev.co.za\",\n        name: \"Demo User\",\n        passwordHash: \"$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL/.LG7my\"\n    },\n    {\n        id: \"2\",\n        email: \"admin@extremev.co.za\",\n        name: \"Admin User\",\n        passwordHash: \"$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL/.LG7my\"\n    }\n];\nconst authOptions = {\n    // Only use adapter if database is available\n    adapter: process.env.DATABASE_URL?.includes(\"localhost\") ? undefined : (0,_next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_3__.PrismaAdapter)(_lib_prisma__WEBPACK_IMPORTED_MODULE_4__.prisma),\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    throw new Error(\"Invalid credentials\");\n                }\n                try {\n                    // Try database first if available\n                    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes(\"localhost\")) {\n                        const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_4__.prisma.user.findUnique({\n                            where: {\n                                email: credentials.email\n                            }\n                        });\n                        if (!user || !user.passwordHash) {\n                            throw new Error(\"Invalid credentials\");\n                        }\n                        const isPasswordValid = await bcryptjs__WEBPACK_IMPORTED_MODULE_5__[\"default\"].compare(credentials.password, user.passwordHash);\n                        if (!isPasswordValid) {\n                            throw new Error(\"Invalid credentials\");\n                        }\n                        return {\n                            id: user.id,\n                            email: user.email,\n                            name: user.name\n                        };\n                    }\n                } catch (dbError) {\n                    console.warn(\"Database not available, using mock authentication\");\n                }\n                // Fallback to mock users for demonstration\n                const user = mockUsers.find((u)=>u.email === credentials.email);\n                if (!user) {\n                    throw new Error(\"Invalid credentials\");\n                }\n                const isPasswordValid = await bcryptjs__WEBPACK_IMPORTED_MODULE_5__[\"default\"].compare(credentials.password, user.passwordHash);\n                if (!isPasswordValid) {\n                    throw new Error(\"Invalid credentials\");\n                }\n                return {\n                    id: user.id,\n                    email: user.email,\n                    name: user.name\n                };\n            }\n        }),\n        // Only include OAuth providers if credentials are properly configured\n        ...process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CLIENT_ID !== \"your-google-client-id\" ? [\n            (0,next_auth_providers_google__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n                clientId: process.env.GOOGLE_CLIENT_ID,\n                clientSecret: process.env.GOOGLE_CLIENT_SECRET,\n                allowDangerousEmailAccountLinking: true\n            })\n        ] : [],\n        ...process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET && process.env.FACEBOOK_CLIENT_ID !== \"your-facebook-app-id\" ? [\n            (0,next_auth_providers_facebook__WEBPACK_IMPORTED_MODULE_2__[\"default\"])({\n                clientId: process.env.FACEBOOK_CLIENT_ID,\n                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,\n                allowDangerousEmailAccountLinking: true\n            })\n        ] : []\n    ],\n    session: {\n        strategy: \"jwt\",\n        maxAge: 30 * 24 * 60 * 60\n    },\n    pages: {\n        signIn: \"/auth/signin\",\n        signOut: \"/auth/signout\",\n        error: \"/auth/error\"\n    },\n    callbacks: {\n        async signIn ({ user, account, profile }) {\n            // Allow all sign-ins\n            // The adapter will handle creating/linking accounts\n            return true;\n        },\n        async jwt ({ token, user, account, profile }) {\n            if (user) {\n                token.id = user.id;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (session.user) {\n                session.user.id = token.id;\n            }\n            return session;\n        }\n    },\n    secret: process.env.NEXTAUTH_SECRET,\n    debug: \"development\" === \"development\"\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXV0aE9wdGlvbnMgfSBmcm9tICduZXh0LWF1dGgnO1xuaW1wb3J0IENyZWRlbnRpYWxzUHJvdmlkZXIgZnJvbSAnbmV4dC1hdXRoL3Byb3ZpZGVycy9jcmVkZW50aWFscyc7XG5pbXBvcnQgR29vZ2xlUHJvdmlkZXIgZnJvbSAnbmV4dC1hdXRoL3Byb3ZpZGVycy9nb29nbGUnO1xuaW1wb3J0IEZhY2Vib29rUHJvdmlkZXIgZnJvbSAnbmV4dC1hdXRoL3Byb3ZpZGVycy9mYWNlYm9vayc7XG5pbXBvcnQgeyBQcmlzbWFBZGFwdGVyIH0gZnJvbSAnQG5leHQtYXV0aC9wcmlzbWEtYWRhcHRlcic7XG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICdAL2xpYi9wcmlzbWEnO1xuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHRqcyc7XG5cbi8vIE1vY2sgdXNlcnMgZm9yIGRlbW9uc3RyYXRpb24gKHdoZW4gZGF0YWJhc2UgaXMgbm90IGF2YWlsYWJsZSlcbmNvbnN0IG1vY2tVc2VycyA9IFtcbiAge1xuICAgIGlkOiAnMScsXG4gICAgZW1haWw6ICdkZW1vQGV4dHJlbWV2LmNvLnphJyxcbiAgICBuYW1lOiAnRGVtbyBVc2VyJyxcbiAgICBwYXNzd29yZEhhc2g6ICckMmEkMTIkTFF2M2MxeXFCV1ZIeGtkMExIQWtDT1l6NlR0eE1RSnFoTjgvTGV3ZEJQai9oTC8uTEc3bXknLCAvLyBcInBhc3N3b3JkXCJcbiAgfSxcbiAge1xuICAgIGlkOiAnMicsXG4gICAgZW1haWw6ICdhZG1pbkBleHRyZW1ldi5jby56YScsXG4gICAgbmFtZTogJ0FkbWluIFVzZXInLFxuICAgIHBhc3N3b3JkSGFzaDogJyQyYSQxMiRMUXYzYzF5cUJXVkh4a2QwTEhBa0NPWXo2VHR4TVFKcWhOOC9MZXdkQlBqL2hMLy5MRzdteScsIC8vIFwicGFzc3dvcmRcIlxuICB9LFxuXTtcblxuZXhwb3J0IGNvbnN0IGF1dGhPcHRpb25zOiBOZXh0QXV0aE9wdGlvbnMgPSB7XG4gIC8vIE9ubHkgdXNlIGFkYXB0ZXIgaWYgZGF0YWJhc2UgaXMgYXZhaWxhYmxlXG4gIGFkYXB0ZXI6IHByb2Nlc3MuZW52LkRBVEFCQVNFX1VSTD8uaW5jbHVkZXMoJ2xvY2FsaG9zdCcpID8gdW5kZWZpbmVkIDogUHJpc21hQWRhcHRlcihwcmlzbWEpLFxuICBwcm92aWRlcnM6IFtcbiAgICBDcmVkZW50aWFsc1Byb3ZpZGVyKHtcbiAgICAgIG5hbWU6ICdjcmVkZW50aWFscycsXG4gICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICBlbWFpbDogeyBsYWJlbDogJ0VtYWlsJywgdHlwZTogJ2VtYWlsJyB9LFxuICAgICAgICBwYXNzd29yZDogeyBsYWJlbDogJ1Bhc3N3b3JkJywgdHlwZTogJ3Bhc3N3b3JkJyB9LFxuICAgICAgfSxcbiAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xuICAgICAgICBpZiAoIWNyZWRlbnRpYWxzPy5lbWFpbCB8fCAhY3JlZGVudGlhbHM/LnBhc3N3b3JkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNyZWRlbnRpYWxzJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRyeSBkYXRhYmFzZSBmaXJzdCBpZiBhdmFpbGFibGVcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuREFUQUJBU0VfVVJMICYmICFwcm9jZXNzLmVudi5EQVRBQkFTRV9VUkwuaW5jbHVkZXMoJ2xvY2FsaG9zdCcpKSB7XG4gICAgICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XG4gICAgICAgICAgICAgIHdoZXJlOiB7XG4gICAgICAgICAgICAgICAgZW1haWw6IGNyZWRlbnRpYWxzLmVtYWlsLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICghdXNlciB8fCAhdXNlci5wYXNzd29yZEhhc2gpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNyZWRlbnRpYWxzJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGlzUGFzc3dvcmRWYWxpZCA9IGF3YWl0IGJjcnlwdC5jb21wYXJlKFxuICAgICAgICAgICAgICBjcmVkZW50aWFscy5wYXNzd29yZCxcbiAgICAgICAgICAgICAgdXNlci5wYXNzd29yZEhhc2hcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICghaXNQYXNzd29yZFZhbGlkKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjcmVkZW50aWFscycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgICAgICAgIG5hbWU6IHVzZXIubmFtZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChkYkVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdEYXRhYmFzZSBub3QgYXZhaWxhYmxlLCB1c2luZyBtb2NrIGF1dGhlbnRpY2F0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGYWxsYmFjayB0byBtb2NrIHVzZXJzIGZvciBkZW1vbnN0cmF0aW9uXG4gICAgICAgIGNvbnN0IHVzZXIgPSBtb2NrVXNlcnMuZmluZCh1ID0+IHUuZW1haWwgPT09IGNyZWRlbnRpYWxzLmVtYWlsKTtcbiAgICAgICAgXG4gICAgICAgIGlmICghdXNlcikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjcmVkZW50aWFscycpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNQYXNzd29yZFZhbGlkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoXG4gICAgICAgICAgY3JlZGVudGlhbHMucGFzc3dvcmQsXG4gICAgICAgICAgdXNlci5wYXNzd29yZEhhc2hcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoIWlzUGFzc3dvcmRWYWxpZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjcmVkZW50aWFscycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogdXNlci5pZCxcbiAgICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgICBuYW1lOiB1c2VyLm5hbWUsXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH0pLFxuICAgIC8vIE9ubHkgaW5jbHVkZSBPQXV0aCBwcm92aWRlcnMgaWYgY3JlZGVudGlhbHMgYXJlIHByb3Blcmx5IGNvbmZpZ3VyZWRcbiAgICAuLi4ocHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9JRCAmJiBcbiAgICAgICAgcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9TRUNSRVQgJiYgXG4gICAgICAgIHByb2Nlc3MuZW52LkdPT0dMRV9DTElFTlRfSUQgIT09ICd5b3VyLWdvb2dsZS1jbGllbnQtaWQnID8gW1xuICAgICAgR29vZ2xlUHJvdmlkZXIoe1xuICAgICAgICBjbGllbnRJZDogcHJvY2Vzcy5lbnYuR09PR0xFX0NMSUVOVF9JRCxcbiAgICAgICAgY2xpZW50U2VjcmV0OiBwcm9jZXNzLmVudi5HT09HTEVfQ0xJRU5UX1NFQ1JFVCxcbiAgICAgICAgYWxsb3dEYW5nZXJvdXNFbWFpbEFjY291bnRMaW5raW5nOiB0cnVlLFxuICAgICAgfSlcbiAgICBdIDogW10pLFxuICAgIC4uLihwcm9jZXNzLmVudi5GQUNFQk9PS19DTElFTlRfSUQgJiYgXG4gICAgICAgIHByb2Nlc3MuZW52LkZBQ0VCT09LX0NMSUVOVF9TRUNSRVQgJiYgXG4gICAgICAgIHByb2Nlc3MuZW52LkZBQ0VCT09LX0NMSUVOVF9JRCAhPT0gJ3lvdXItZmFjZWJvb2stYXBwLWlkJyA/IFtcbiAgICAgIEZhY2Vib29rUHJvdmlkZXIoe1xuICAgICAgICBjbGllbnRJZDogcHJvY2Vzcy5lbnYuRkFDRUJPT0tfQ0xJRU5UX0lELFxuICAgICAgICBjbGllbnRTZWNyZXQ6IHByb2Nlc3MuZW52LkZBQ0VCT09LX0NMSUVOVF9TRUNSRVQsXG4gICAgICAgIGFsbG93RGFuZ2Vyb3VzRW1haWxBY2NvdW50TGlua2luZzogdHJ1ZSxcbiAgICAgIH0pXG4gICAgXSA6IFtdKSxcbiAgXSxcbiAgc2Vzc2lvbjoge1xuICAgIHN0cmF0ZWd5OiAnand0JyxcbiAgICBtYXhBZ2U6IDMwICogMjQgKiA2MCAqIDYwLCAvLyAzMCBkYXlzXG4gIH0sXG4gIHBhZ2VzOiB7XG4gICAgc2lnbkluOiAnL2F1dGgvc2lnbmluJyxcbiAgICBzaWduT3V0OiAnL2F1dGgvc2lnbm91dCcsXG4gICAgZXJyb3I6ICcvYXV0aC9lcnJvcicsXG4gIH0sXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIHNpZ25Jbih7IHVzZXIsIGFjY291bnQsIHByb2ZpbGUgfSkge1xuICAgICAgLy8gQWxsb3cgYWxsIHNpZ24taW5zXG4gICAgICAvLyBUaGUgYWRhcHRlciB3aWxsIGhhbmRsZSBjcmVhdGluZy9saW5raW5nIGFjY291bnRzXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGFzeW5jIGp3dCh7IHRva2VuLCB1c2VyLCBhY2NvdW50LCBwcm9maWxlIH0pIHtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHRva2VuLmlkID0gdXNlci5pZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICBpZiAoc2Vzc2lvbi51c2VyKSB7XG4gICAgICAgIHNlc3Npb24udXNlci5pZCA9IHRva2VuLmlkIGFzIHN0cmluZztcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZXNzaW9uO1xuICAgIH0sXG4gIH0sXG4gIHNlY3JldDogcHJvY2Vzcy5lbnYuTkVYVEFVVEhfU0VDUkVULFxuICBkZWJ1ZzogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcsXG59O1xuIl0sIm5hbWVzIjpbIkNyZWRlbnRpYWxzUHJvdmlkZXIiLCJHb29nbGVQcm92aWRlciIsIkZhY2Vib29rUHJvdmlkZXIiLCJQcmlzbWFBZGFwdGVyIiwicHJpc21hIiwiYmNyeXB0IiwibW9ja1VzZXJzIiwiaWQiLCJlbWFpbCIsIm5hbWUiLCJwYXNzd29yZEhhc2giLCJhdXRoT3B0aW9ucyIsImFkYXB0ZXIiLCJwcm9jZXNzIiwiZW52IiwiREFUQUJBU0VfVVJMIiwiaW5jbHVkZXMiLCJ1bmRlZmluZWQiLCJwcm92aWRlcnMiLCJjcmVkZW50aWFscyIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwiRXJyb3IiLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiaXNQYXNzd29yZFZhbGlkIiwiY29tcGFyZSIsImRiRXJyb3IiLCJjb25zb2xlIiwid2FybiIsImZpbmQiLCJ1IiwiR09PR0xFX0NMSUVOVF9JRCIsIkdPT0dMRV9DTElFTlRfU0VDUkVUIiwiY2xpZW50SWQiLCJjbGllbnRTZWNyZXQiLCJhbGxvd0Rhbmdlcm91c0VtYWlsQWNjb3VudExpbmtpbmciLCJGQUNFQk9PS19DTElFTlRfSUQiLCJGQUNFQk9PS19DTElFTlRfU0VDUkVUIiwic2Vzc2lvbiIsInN0cmF0ZWd5IiwibWF4QWdlIiwicGFnZXMiLCJzaWduSW4iLCJzaWduT3V0IiwiZXJyb3IiLCJjYWxsYmFja3MiLCJhY2NvdW50IiwicHJvZmlsZSIsImp3dCIsInRva2VuIiwic2VjcmV0IiwiTkVYVEFVVEhfU0VDUkVUIiwiZGVidWciXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\n// PrismaClient is attached to the `global` object in development to prevent\n// exhausting your database connection limit.\n// Learn more: https://pris.ly/d/help/next-js-best-practices\nconst globalForPrisma = global;\nlet prismaInstance = null;\ntry {\n    prismaInstance = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n        log:  true ? [\n            \"error\"\n        ] // Reduced logging to avoid spam when DB is not available\n         : 0\n    });\n    if (true) {\n        globalForPrisma.prisma = prismaInstance;\n    }\n} catch (error) {\n    console.warn(\"Prisma client initialization failed:\", error);\n    prismaInstance = null;\n}\nconst prisma = prismaInstance;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBOEM7QUFFOUMsNEVBQTRFO0FBQzVFLDZDQUE2QztBQUM3Qyw0REFBNEQ7QUFFNUQsTUFBTUMsa0JBQWtCQztBQUV4QixJQUFJQyxpQkFBc0M7QUFFMUMsSUFBSTtJQUNGQSxpQkFBaUJGLGdCQUFnQkcsTUFBTSxJQUNyQyxJQUFJSix3REFBWUEsQ0FBQztRQUNmSyxLQUNFQyxLQUF5QixHQUNyQjtZQUFDO1NBQVEsQ0FBQyx5REFBeUQ7V0FDbkUsQ0FBUztJQUNqQjtJQUVGLElBQUlBLElBQXlCLEVBQWM7UUFDekNMLGdCQUFnQkcsTUFBTSxHQUFHRDtJQUMzQjtBQUNGLEVBQUUsT0FBT0ksT0FBTztJQUNkQyxRQUFRQyxJQUFJLENBQUMsd0NBQXdDRjtJQUNyREosaUJBQWlCO0FBQ25CO0FBRU8sTUFBTUMsU0FBU0QsZUFBK0I7QUFFckQsaUVBQWVDLE1BQU1BLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJzaXRlLy4vbGliL3ByaXNtYS50cz85ODIyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcblxuLy8gUHJpc21hQ2xpZW50IGlzIGF0dGFjaGVkIHRvIHRoZSBgZ2xvYmFsYCBvYmplY3QgaW4gZGV2ZWxvcG1lbnQgdG8gcHJldmVudFxuLy8gZXhoYXVzdGluZyB5b3VyIGRhdGFiYXNlIGNvbm5lY3Rpb24gbGltaXQuXG4vLyBMZWFybiBtb3JlOiBodHRwczovL3ByaXMubHkvZC9oZWxwL25leHQtanMtYmVzdC1wcmFjdGljZXNcblxuY29uc3QgZ2xvYmFsRm9yUHJpc21hID0gZ2xvYmFsIGFzIHVua25vd24gYXMgeyBwcmlzbWE6IFByaXNtYUNsaWVudCB8IG51bGwgfTtcblxubGV0IHByaXNtYUluc3RhbmNlOiBQcmlzbWFDbGllbnQgfCBudWxsID0gbnVsbDtcblxudHJ5IHtcbiAgcHJpc21hSW5zdGFuY2UgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hIHx8XG4gICAgbmV3IFByaXNtYUNsaWVudCh7XG4gICAgICBsb2c6XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnXG4gICAgICAgICAgPyBbJ2Vycm9yJ10gLy8gUmVkdWNlZCBsb2dnaW5nIHRvIGF2b2lkIHNwYW0gd2hlbiBEQiBpcyBub3QgYXZhaWxhYmxlXG4gICAgICAgICAgOiBbJ2Vycm9yJ10sXG4gICAgfSk7XG5cbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hSW5zdGFuY2U7XG4gIH1cbn0gY2F0Y2ggKGVycm9yKSB7XG4gIGNvbnNvbGUud2FybignUHJpc21hIGNsaWVudCBpbml0aWFsaXphdGlvbiBmYWlsZWQ6JywgZXJyb3IpO1xuICBwcmlzbWFJbnN0YW5jZSA9IG51bGw7XG59XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBwcmlzbWFJbnN0YW5jZSBhcyBQcmlzbWFDbGllbnQ7XG5cbmV4cG9ydCBkZWZhdWx0IHByaXNtYTtcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWwiLCJwcmlzbWFJbnN0YW5jZSIsInByaXNtYSIsImxvZyIsInByb2Nlc3MiLCJlcnJvciIsImNvbnNvbGUiLCJ3YXJuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/uuid","vendor-chunks/oauth","vendor-chunks/@panva","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/bcryptjs","vendor-chunks/preact","vendor-chunks/oidc-token-hash","vendor-chunks/cookie","vendor-chunks/@next-auth"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Falmeidajose%2FDocuments%2FA%2FApp%2FExtreme%20V%2FWebsite%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Falmeidajose%2FDocuments%2FA%2FApp%2FExtreme%20V%2FWebsite&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();