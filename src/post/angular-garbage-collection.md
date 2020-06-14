---
title: Where Javascript Memory Management Ends and Angular $destroy Begins
date: 2016-04-30
tags: post
layout: layouts/post.liquid
---

### A brief look inside the source code inspired by this [SO question](http://stackoverflow.com/questions/36273862/do-i-need-to-destroy-local-controller-variables-when-directive-is-destroyed/36390832#36390832)

Keep this example controller function in mind:

```js
angular.module('myModule').controller('fileUploadCtrl', function($scope, FileUploader){

    $scope.uploader = new FileUploader({
        settings: {}
    });

    var reader = new FileReader(); 
    
    reader.onload = function(event) {
      var img = new Image();
      img.onload = onLoadImage;
    }

});
```

### Javascript memory management — garbage collector

Memory [will be allocated for an object when created](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management).

```js
var o = {iThink: ‘thereforeIAm’}; // memory allocated for an object and a string
```

You may then _console.log(o.iThink)_ and *‘thereforeIAm’* will be read from its place in memory and printed to the console.

If you wanted to create a new string and lost the _need_ for the _{iThink: ‘thereforeIAm’}_ object, you may decide to overwrite _o_ instead of introducing a new variable.

```js
var o = {iThink: ‘thereforeIAm’}; // memory allocated for an object and a string

o = ‘helloImANewString’;
```

Fortunately, references (or lack thereof) send a clear message internally to javascript’s garbage collector as to whether a piece of finite memory should remain allocated or freed to perform other tasks. In this case, no reference remains to the object and string previously allocated for _{iThink: ‘thereforeIAm’}_ and the corresponding memory may be freed (i.e. “garbage-collected”) as result.

Importantly, note that garbage collection happens internally. No code has to be written by you to that effect. All you need to concern yourself with is the value of _o_ and the garbage collector can _infer need_, more or less, _from remaining reference_.

### Angular memory management — $scope.$destroy

Unfortunately, the cleanup tasks related to _\$scope_ removal* cannot be inferred* by the javascript garbage collector based on* reference alone*; additional code is required.

That is because _\$scope_ objects embody a concept more complex than any ol’ javascript object. In particular, when no use remains in your application for a certain _\$scope_ object, no use *must also remain *for any associated _\$\$watchers_ previously registered with the _$scope.$watch_ method and no use _must also remain_ for “children” _\$scope_ objects. The javascript garbage collector cannot infer this relationship from simple reference removal. Setting _\$scope_ to *null *will certainly clear the memory allocated directly for such object, but not much else can be accomplished.

<iframe src="https://medium.com/media/da926651a5fea089a2703a3ac13d9e8d" frameborder=0></iframe>

In other words, the garbage collector has to be told what to do ([and when to do it](https://github.com/angular/angular.js/blob/v1.5.5/src/ng/directive/ngIf.js#L113)), which is exactly what the [_$scope.$destroy_ method](https://github.com/angular/angular.js/blob/v1.5.3/src/ng/rootScope.js#L895) does. Note these lines in particular:

<iframe src="https://medium.com/media/f2652d920afc47f6b9ec9659ace8e855" frameborder=0></iframe>

### The example controller function

When a function is invoked, the memory allocated for internally scoped objects will only remain allocated to the extent references remain past the life of the invocation (non-coincidentally, the essence of a closure).

In the example of the controller, _uploader_ and _reader_ objects are created and _uploader_ is set to scope. No references remain to _reader_ at all after the controller function is run, rendering _reader_ eligible for garbage collection immediately thereafter. On the other hand, _uploader_ is attached to an object that outlives the function’s invocation and so must remain an occupant of allocated memory until such object is destroyed. As a result, only a call to _$scope.$destroy_ would enable the reallocation of memory once allocated to *uploader *as the lack of need cannot be inferred from reference alone.

**Quote of the day:**

> Each product era can be divided into two phases: 1) _the gestation phase_, when the new platform is first introduced but is expensive, incomplete, and/or difficult to use, 2) _the growth phase_, when a new product comes along that solves those problems, kicking off a period of exponential growth. The Apple II was released in 1977 (and the Altair in 1975), but it was the release of the IBM PC in 1981 that kicked off the PC growth phase. The internet’s gestation phase took place in the [80s and early 90s](https://en.wikipedia.org/wiki/National_Science_Foundation_Network) when it was mostly a text-based tool used by academia and government. The release of the Mosaic web browser in 1993 started the growth phase, which has continued ever since.There were feature phones in the 90s and early smartphones like the Sidekick and Blackberry in the early 2000s, but the smartphone growth phase really started in 2007–8 with the release of the iPhone and then Android.
> — [Chris Dixon](https://medium.com/software-is-eating-the-world/what-s-next-in-computing-e54b870b80cc#.jszig85hi)
> Done in 1.77s.
