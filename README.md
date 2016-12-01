## fuzzytrie

Dynamic word set with accelerated exact and fuzzy search based on trie data structure.

## Usage

### Create FuzzyTrie
FuzzyTrie constructor has no parameters:
```js
var FuzzyTrie = require('fuzzytrie');

var trie = new FuzzyTrie();
```

### Insert
To insert into the trie use "add" method with single argument:
```js
trie.add('hello');
```

### Remove
Use "delete" method to remove a word from the trie:
```js
trie.delete('hello');
```

### Check existence
Use "has" to detemine that trie contains a word:
```js
trie.add('word');
var b = trie.has('word'); // b == true
trie.delete('word');
b = trie.has('word'); // b == false
```

### Search
Although you can "has" to exact search, the is also a method called "find" that can be used to find all words in the trie that "approximately" equals to the given word.
In fact, "find" implements fuzzy search with [UNRESTRICTED Damerau–Levenshtein Distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) metric.
It's accelerated with underlying trie data structure so it's performance is sublinear.
Maximal distance from given word is passed with second parameter of "find". It returns JavaScript Object with words as keys and their distances as values.
If there are no words in the trie within given distance, it returns empty Object({}).
```js
var maxDistance = 2;
var result = trie.find('hello',maxDistance);
// r == { <word1>: <distance from 'hello' to word1>, <word2>: <distance from 'hello' to word2>,... };

```
You should remember that performance of the "find" method is critically depends on the maximal distance parameter.

### Clear
You can remove clear the trie with "clear" method:
```js
trie.clear();
```

### All
Array of all words contained in the trie can be aquired with "all".
```js
var a = trie.all();
// a = [...];
```
