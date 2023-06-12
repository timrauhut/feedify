# Feedify

A simple, yet powerful, utility to create an Atom Feed from your HTML files. It allows you to scan a directory for HTML files, parse the content, and generate a compliant Atom Feed that can be consumed by RSS readers or other services.

## Installation

```sh
npm install @timrauhut/feedify
```

## Usage

```javascript
import generateFeed from '@timrauhut/feedify';

const config = {
  htmlDirectory: './path/to/html/files', // Directory containing HTML files
  outputFilePath: 'path/to/output/atom_feed.xml', // Output path for the generated Atom feed
  feedURL: 'https://example.com/feed.xml', // URL for your Atom feed
  feedTitle: 'Example Feed', // Title for your Atom feed
  selectors: {
    title: '.title', // Title selector for your post
    url: '.url', // URL selector for your post
    summary: '.summary', // Summary selector for your post
    date: '.date', // Date selector for your post
    author: '.author'// Author selector for your post
  }
};

generateFeed(config);
```

## Config Options

- `htmlDirectory` (string): The local directory containing your HTML files.
- `outputFilePath` (string): The file path where your Atom feed will be written.
- `feedURL` (string): The URL of your feed.
- `feedTitle` (string): The title of your feed.
- `selectors`: An object representing the CSS selectors for the necessary elements in the HTML files. This object should have the following properties:
    - `title`: The CSS selector for the post title.
    - `url`: The CSS selector for the post URL.
    - `summary`: The CSS selector for the post summary.
    - `date`: The CSS selector for the post date.
    - `author`: The CSS selector for the post author.

Please note that the CSS selectors should directly refer to the respective elements in the HTML files. Each HTML file is considered as a separate post.

## Functions

Feedify exposes the following functions:

- `generateFeed(config: Config): void` - The main function that reads HTML files, parses them, generates an Atom feed, and writes it to a file.

## Interfaces

Feedify uses the following interfaces:

- `Entry` - Represents an individual entry in the Atom feed.
  - `title`: Title of the entry
  - `url`: URL of the entry
  - `summary`: Summary of the entry
  - `date`: Date of the entry
  - `author`: Author of the entry

## Test

To run the test suite:

```sh
npm test
```

## License

MIT

## Contributing

Open an issue or a pull request to suggest changes or additions.

## Support

If you have any issues or feature requests, please file issues or submit PRs on the GitHub repo.
