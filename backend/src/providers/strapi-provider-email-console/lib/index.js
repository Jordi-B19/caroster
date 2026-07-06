"use strict";

/**
 * Module dependencies
 */

const _ = require("lodash");

const emailFields = [
  "from",
  "replyTo",
  "to",
  "cc",
  "bcc",
  "subject",
  "text",
  // "html",
  // "attachments",
];

module.exports = {
  provider: "console",
  name: "Console Email Provider",

  init(providerOptions = {}, settings = {}) {
    return {
      send(options) {
        // Default values.
        const emailOptions = {
          ..._.pick(options, emailFields),
          from: options.from || settings.defaultFrom,
          replyTo: options.replyTo || settings.defaultReplyTo,
          text: options.text || options.html,
          // html: options.html || options.text,
        };

        const logLevel = options.logLevel || settings.logLevel || "log";

        return console[logLevel]("Email sent:", emailOptions);
      },
    };
  },
};
