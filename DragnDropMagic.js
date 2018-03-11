var dragSrcEl = null;

function handleDragStart(e) {
  // Target (this) element is the source node.
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML);

  this.classList.add('dragElem');
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  this.classList.add('over');

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
}

function handleDragLeave(e) {
  this.classList.remove('over');  // this / e.target is previous target element.
}

function handleDrop(e) {
  // this/e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // Stops some browsers from redirecting.
  }

  // Don't do anything if dropping the same column we're dragging.
  if (dragSrcEl != this) {
    // Set the source column's HTML to the HTML of the column we dropped on.
    //alert(this.outerHTML);
    //dragSrcEl.innerHTML = this.innerHTML;
    //this.innerHTML = e.dataTransfer.getData('text/html');
    this.parentNode.removeChild(dragSrcEl);
    var dropHTML = e.dataTransfer.getData('text/html');
    this.insertAdjacentHTML('beforebegin',dropHTML);
    var dropElem = this.previousSibling;
    addDnDHandlers(dropElem);
    
  }
  this.classList.remove('over');
  return false;
}

function handleDragEnd(e) {
  // this/e.target is the source node.
  this.classList.remove('over');

  /*[].forEach.call(cols, function (col) {
    col.classList.remove('over');
  });*/
}

function addDnDHandlers(elem) {
  elem.addEventListener('dragstart', handleDragStart, false);
  elem.addEventListener('dragenter', handleDragEnter, false)
  elem.addEventListener('dragover', handleDragOver, false);
  elem.addEventListener('dragleave', handleDragLeave, false);
  elem.addEventListener('drop', handleDrop, false);
  elem.addEventListener('dragend', handleDragEnd, false);
  elem.addEventListener('itemAdded', addItem, false);
}

var cols = document.querySelectorAll('#columns .column');
[].forEach.call(cols, addDnDHandlers);

//add a watcher for file uploader to avoid large files
var uploadField = document.getElementById("fileInput");
uploadField.onchange = function() {
    if(this.files[0].size > 102400){
       alert("File is too big!");
       this.value = "";
    };
};

//adding items to the list
function addItem(){
  //get the name of the item
  var nameTarget = $("#item-name");
  var name = nameTarget.val();
  //get the description of the item
  var descriptionTarget = $("#description");
  var description = descriptionTarget.val();
  //get image
  var input = document.getElementById('fileInput');
  var file = input.files[0];
  var fr = new FileReader();
      fr.readAsDataURL(file);
  //set a dinamic id to avoid overstepping images
  var dynId = ($(".column").length) + 1;
  //get the target where we append the new item
  var $container = $('#columns');
  var item ='<li class="column" draggable="true"><header>'+name+
  '<span id="description-envelope">'+" "+description+
  '</span><img id='+dynId+
  ' src="#" class="img-envelope"><button onclick="deleteItem()">delete</button><button onclick="editItem(this)">edit</button></header></li>';
  var $item = $(item);
  $container.append($item)
  //insert the image based on the dynId
  fr.onload = inserter;
  var insertId = "#"+dynId;
  function inserter(){
    $(insertId).attr('src', fr.result);
  }
  //add event handlers to new item
  addDnDHandlers($item[0]);
  //update count
  var countLen = $(".column").length;
  //update counter with item
  counter.change(counter.element.value = countLen);
  //finally reset all to blank
  nameTarget.val("");
  descriptionTarget.val("");
  input.value = "";
  //get current list state
  var list = document.getElementById("columns");
  var sessionList = mapDOM(list,true);
  localStorage['session'] = sessionList;
}

//deleting items to the list
function deleteItem(){
  var deleteThis = $('#columns .column');
  deleteThis.click(function(){
    $(this).remove();
  });
  //update count
  var countLen = ($(".column").length) - 1;
  //update counter with item
  counter.change(counter.element.value = countLen);
}

function editItem(element){
  //edit decription text
  var editThis = element.parentNode.children[0];
  var checkEdit = editThis.contentEditable;
  if(checkEdit == "inherit" || checkEdit == "false")
  {
    //make description field editable and add a highlight
    editThis.contentEditable = true;
    editThis.classList.add('edit-highligth');
    //add an input to change image
    var imageInput = '<input type="file" id="replaceInput" accept="image/*" />';
    var $imageInput = $(imageInput);
    element.parentElement.append($imageInput[0]);
    //and button text to allow commit edit
    element.innerHTML = "confirm edit!";
  }
  else
  {
    editThis.contentEditable = false;
    editThis.classList.remove('edit-highligth');
    //return button to normal text
    element.innerHTML = "edit";
    //check if an image has been loaded and replace the old one
    imageReplace(element);
    //remove the added input field
    element.parentElement.children.replaceInput.remove();
  }
}

function imageReplace(element){
  var replaceInput = element.parentElement.children.replaceInput;
  var imgChecker = $('.img-envelope');
  var imgCheckerInd = imgChecker[0];
  var oldImg = element.parentElement.hasChildNodes(imgCheckerInd);
    if(replaceInput && oldImg)
    {
      //replace old image with new one
      var repFile = element.parentElement.children.replaceInput.files[0];
      //start new file reader on the file input
      var frep = new FileReader();
          frep.readAsDataURL(repFile);
      //replace the image node with the new source value
      var RepImgNode = element.parentElement.childNodes;
      for(var entry of RepImgNode.entries()) {
        var index = entry[0];
        var name = entry[1].className;
        if(name =="img-envelope"){
        var repIndex = index;
        break;
        }
      }

      frep.onload = checkFile;

      function checkFile()
      {
        var replaceThis = RepImgNode[repIndex];
        try
        {
          if(frep.readyState == 2 || frep.result != "")
          {
          replaceThis.src = frep.result;
          }
        }
        catch(error)
        {
          console.log("something went wrong")
          console.error(error);
        }
        finally
        {
          replaceThis.src = frep.result;
        }
      }
    } 
  }

//create a counter
function MyCounter(element, data){
  this.data = data;
  this.element = element;
  element.value = data;
  element.addEventListener("change", this, false);
}
//extend counter and add change class
MyCounter.prototype.change = function (value) {
    this.data = value;
    this.element.value = value;
};

var countLen = $(".column").length;
var counter = new MyCounter(document.getElementById("counter"), countLen);

//the final insult, a JSON parser to store the session
function mapDOM(element, json) {
    var treeObject = {};

    // If string convert to document Node
    if (typeof element === "string") {
        if (window.DOMParser) {
              parser = new DOMParser();
              docNode = parser.parseFromString(element,"text/xml");
        } else { // Microsoft strikes again
              docNode = new ActiveXObject("Microsoft.XMLDOM");
              docNode.async = false;
              docNode.loadXML(element); 
        } 
        element = docNode.firstChild;
    }

    //Recursively loop through DOM elements and assign properties to object
    function treeHTML(element, object) {
        object["type"] = element.nodeName;
        var nodeList = element.childNodes;
        if (nodeList != null) {
            if (nodeList.length) {
                object["content"] = [];
                for (var i = 0; i < nodeList.length; i++) {
                    if (nodeList[i].nodeType == 3) {
                        object["content"].push(nodeList[i].nodeValue);
                    } else {
                        object["content"].push({});
                        treeHTML(nodeList[i], object["content"][object["content"].length -1]);
                    }
                }
            }
        }
        if (element.attributes != null) {
            if (element.attributes.length) {
                object["attributes"] = {};
                for (var i = 0; i < element.attributes.length; i++) {
                    object["attributes"][element.attributes[i].nodeName] = element.attributes[i].nodeValue;
                }
            }
        }
    }
    treeHTML(element, treeObject);

    return (json) ? JSON.stringify(treeObject) : treeObject;
}
//at the start of the session, check if there is data stored in cache
$(document).ready(function()
{ 
  if(localStorage['session'])
  {
    var restoreData = JSON.parse(localStorage['session']);
    var resCont = document.getElementById("columns");
  }
});
