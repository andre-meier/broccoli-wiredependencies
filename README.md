broccoli-wiredependencies
=========================

Provides an easy way to inject your projects javascript- or css-files in a broccoli build task.

## Installation

Install broccoli-wirdedependencies from npm registry:

	$npm i broccoli-wiredependencies --save-dev
	
Or install bleeding edge version from GitHub repo:

	$npm i git://github.com/andre-meier/broccoli-wiredependencies.git
	
## Usage

Like all broccoli plugins, `broccoli-wiredependencies` accepts an `inputTree` and an `options`-hash. 

```javascript
var wiredependencies = require('broccoli-inject-livereload');

var inputTree = 'src/';
var public = injectLivereload(inputTree, options);

```

`inputTree` *{Single tree}*

A Broccoli tree. A tree in Broccoli can be either a string that references a
directory in your project or a tree structure returned from running another
Broccoli plugin.

**Note:** `broccoli-wiredependencies` will return a new tree including your modified `src`-file and the wired javascript and css-files. If you want to include additional files in your output folder, you'll have to use [broccoli-merge-trees](https://github.com/broccolijs/broccoli-merge-trees).

###options

#### src
Type: *{String}*  
Default: *index.html*

The template file where you want to include your css and javascript files. The file must have the following comments which are replaced by the javascript- / css-inludes:

* For inclusion of you stylesheets:  `<!-- include:styles -->`  
* For inclusion of you javascript files  `<!-- include:scripts -->`

#### bower
Type: *{Boolean}*  
Default: *true*

Defines, whether or not you want `broccoli-wiredependencies` to wire up your bower-packages. Internally using [wiredep](https://github.com/taptapship/wiredep) to resolve your bower packages and their dependencies.

#### ignoreBowerStylesheets
Type: *{Boolean}*
Default: *true*

Defines, whether or not you want to wire up your sass or css from your bower dependencies. You may want to turn this on if you're using sass in include all your dependencies by hand.

#### paths

##### js:

Type: *{String}*  
Default: *js*

The path were your javascript-dependencies are copied to.

##### css:

Type: *{String}*  
Default: *js*

The path were your stylesheet-dependencies are copied to.

#### wiredep

Type: {Hash}
Default: {}

Options you want to pass to [wiredep](https://github.com/taptapship/wiredep) when wiring up bower dependencies. You can check [wiredep Documentation](https://github.com/taptapship/wiredep/tree/v2.2.2#configuration) for further information about available options.

## License
This project is licensed under the MIT License (MIT)

Copyright (c) 2017 André Meier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
