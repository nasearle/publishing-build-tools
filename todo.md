in notes:
  replace `code` with <code></code>
  markdown links dont work

// ORDER!
markdown = markdown.replace(/(\W)[^\S\n](\[.*?\]\(.*?\))/g, '$1$2');
markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

Fixed:

* space gets added after bold. but GitBook ignores the second space for text but not punctuation
* pulling out google.developers.com
* space gets added infront of markdown links - only an issue with punctuation
looks like claat does this.


Other:

add styles
