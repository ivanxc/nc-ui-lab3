var _a,_b,_c,__awaiter=this&&this.__awaiter||function(e,d,i,s){return new(i=i||Promise)(function(l,t){function n(e){try{r(s.next(e))}catch(e){t(e)}}function o(e){try{r(s.throw(e))}catch(e){t(e)}}function r(e){var t;e.done?l(e.value):((t=e.value)instanceof i?t:new i(function(e){e(t)})).then(n,o)}r((s=s.apply(e,d||[])).next())})};import{TreeNode}from"../node.js";import{Tree}from"../tree.js";console.log("start");let tree=null,nodeToHtml=new Map;const sheets=document.getElementById("sheets"),lines=document.getElementById("lines");function render(e){var t=e.value,l=null===(r=null===tree||void 0===tree?void 0:tree.getPatchToNode(t))||void 0===r?void 0:r.at(-1),e=nodeToHtml.get(l);let n=e?null==e?void 0:e.style.top:"0px",o=e?null==e?void 0:e.style.left:"0px";var r=parseInt(n.substring(0,n.length-2))+60+"px";let d=parseInt(o.substring(0,o.length-2))+750+"px";e=null===(e=null===tree||void 0===tree?void 0:tree.getPatchToNode(t))||void 0===e?void 0:e.length;let i=1;return null!=l&&(i=null==e?2:Math.pow(1.7,e),d=t<l.value?parseInt(o.substring(0,o.length-2))-500/i+"px":parseInt(o.substring(0,o.length-2))+500/i+"px"),createNewElement(t,r,d)}function createNewElement(e,t,l){const n=document.createElement("div");return n.className="node",n.textContent=e,n.style.left=l,n.style.top=t,null!==sheets&&sheets.append(n),n}function add(){return __awaiter(this,void 0,void 0,function*(){var e=document.getElementById("value"),t=parseInt(null==e?void 0:e.value);null!==tree&&null!==tree.findNodeByValue(t)||(e=new TreeNode(t),null===tree&&null!==t?tree=new Tree(e):null!==tree&&void 0!==tree&&tree.add(e),yield showPatch(t),t=render(e),nodeToHtml.set(e,t),markSheet(e),drawLines())})}function remove(){return __awaiter(this,void 0,void 0,function*(){var t=document.getElementById("value"),e=parseInt(null==t?void 0:t.value);if(void 0!==e&&null!==tree){t=tree.findNodeByValue(e);if(null!=t){if(yield showPatch(e),yield markSheet(t),null===t.rightNode&&null!==t.leftNode)yield markSheet(t.leftNode);else if(null!==t.rightNode&&null===t.leftNode)yield markSheet(t.rightNode);else if(null!==t.rightNode&&null!==t.leftNode){let e=tree.getLeftmostSheetOf(t.rightNode);null===e&&(e=t.rightNode),yield markSheet(t),yield markSheet(e)}tree.remove(e),yield resetSheets(),yield drawLines()}}})}function renderAll(e){var t=render(e);nodeToHtml.set(e,t),null!==e.rightNode&&renderAll(e.rightNode),null!==e.leftNode&&renderAll(e.leftNode)}function resetSheets(){null!==sheets&&void 0!==sheets&&(sheets.innerHTML=""),null!==tree&&null!==tree._root&&renderAll(tree._root)}function search(){return __awaiter(this,void 0,void 0,function*(){var e=document.getElementById("value"),e=parseInt(null==e?void 0:e.value),e=null===tree||void 0===tree?void 0:tree.findNodeByValue(e);null!=e&&(yield markSheet(e))})}function drawLines(){lines.innerHTML="";for(var e of nodeToHtml.keys())null!==e.rightNode&&drawLine(nodeToHtml.get(e),nodeToHtml.get(e.rightNode)),null!==e.leftNode&&drawLine(nodeToHtml.get(e),nodeToHtml.get(e.leftNode))}function drawLine(e,t){if(void 0!==e&&void 0!==t){const d=document.createElement("div");d.className="line",d.style.zIndex="-999";var l=parseInt(e.style.top.substring(0,e.style.top.length-2)),n=(parseInt(t.style.top.substring(0,t.style.top.length-2)),parseInt(e.style.left.substring(0,e.style.left.length-2))),o=parseInt(t.style.left.substring(0,t.style.left.length-2)),r=50;d.style.left=e.style.left,d.style.top=l+r+"px",o<n&&(r=-50,d.style.left=t.style.left,d.style.top=t.style.top+r+"px");o=Math.sqrt(Math.pow(60,2)+Math.pow(Math.abs(n-o),2));d.style.width=o+"px";o=60/(o-20);r<0&&(o=3.1416-o),d.style.transform="rotate("+o+"rad)",null!==lines&&void 0!==lines&&lines.append(d)}}function markSheet(t){return __awaiter(this,void 0,void 0,function*(){let e=nodeToHtml.get(t);void 0!==e&&(e.className+=" marked",e.style.backgroundColor="#ef6351",yield delay(1e3),e.style.backgroundColor="#b2dbbf",e.className="node")})}function delay(t){return new Promise(e=>{setTimeout(()=>{e(2)},t)})}function showPatch(l){return __awaiter(this,void 0,void 0,function*(){if(null!=tree){var e=tree.getPatchToNode(l);if(null!==e)for(const t of e){markSheet(t);yield delay(1e3)}}})}null!==(_a=document.getElementById("add"))&&void 0!==_a&&_a.addEventListener("click",add),null!==(_b=document.getElementById("remove"))&&void 0!==_b&&_b.addEventListener("click",remove),null!==(_c=document.getElementById("search"))&&void 0!==_c&&_c.addEventListener("click",search);