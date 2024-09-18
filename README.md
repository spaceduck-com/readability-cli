# readability-cli

Simple CLI wrapper around [`@mozilla/readability`](https://github.com/mozilla/readability) and (optionally) [DOMPurify](https://github.com/cure53/DOMPurify).

Made with ❤️ by [spaceduck.com](https://www.spaceduck.com?utm_source=github&utm_medium=readme&utm_id=oss.rcli)


## Installation

```console
$ npm install -g @spaceduckapp/readability-cli
```

## Usage

Basic:
```console
$ readability-cli path/to/input.html --out path/to/output.json
```


Using stdin / stdout:
```console
$ cat path/to/input.html | readability-cli - > path/to/output.json
```

Show help:
```console
$ readability-cli --help
```

Demo (using [`curl`](https://curl.se/) and [`jq`](https://jqlang.github.io/jq/)):
```console
$ curl --silent 'https://example.com/' | readability-cli - --sanitize | jq
{
  "title": "Example Domain",
  "byline": null,
  "dir": null,
  "lang": null,
  "content": "<div id=\"readability-page-1\" class=\"page\"><div>\n    \n    <p>This domain is for use in illustrative examples in documents. You may use this\n    domain in literature without prior coordination or asking for permission.</p>\n    <p><a href=\"https://www.iana.org/domains/example\">More information...</a></p>\n</div></div>",
  "textContent": "\n    \n    This domain is for use in illustrative examples in documents. You may use this\n    domain in literature without prior coordination or asking for permission.\n    More information...\n",
  "length": 191,
  "excerpt": "This domain is for use in illustrative examples in documents. You may use this\n    domain in literature without prior coordination or asking for permission.",
  "siteName": null,
  "publishedTime": null
}
```