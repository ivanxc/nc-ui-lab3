import {TreeNode} from "../node.js";
import {Tree} from "../tree.js";

console.log("start");

let tree: Tree<any> | null = null;
let nodeToHtml: Map<TreeNode<any>, HTMLElement> = new Map<TreeNode<any>, HTMLElement>();
const sheets: HTMLElement | null = document.getElementById("sheets");
const lines = document.getElementById('lines');

document.getElementById('add')?.addEventListener('click', add);
document.getElementById('remove')?.addEventListener('click', remove);
document.getElementById('search')?.addEventListener('click', search);

function render(node: TreeNode<any>): HTMLElement {
  const value = node.value;

  const rootLeft = 750;
  const distance = 500;

  // @ts-ignore
  let parentNode: TreeNode<any> = tree?.getPatchToNode(value)?.at(-1);
  let parentElement = nodeToHtml.get(parentNode);

  let parentTop: string = parentElement ? parentElement?.style.top : "0px";
  let parentLeft: string = parentElement ? parentElement?.style.left : "0px";

  let topStyle = parseInt(parentTop.substring(0, parentTop.length - 2)) + 60 + 'px';
  let leftStyle = parseInt(parentLeft.substring(0, parentLeft.length - 2)) + rootLeft + 'px';

  let level: number | undefined = tree?.getPatchToNode(value)?.length;

  let distanceCoefficient: number = 1;

  if (parentNode !== null && parentNode !== undefined) {

    if (level == undefined) {
      distanceCoefficient = 2;
    } else {
      distanceCoefficient = Math.pow(1.7, level);
    }

    if (value < parentNode.value) {
      leftStyle = parseInt(parentLeft.substring(0, parentLeft.length - 2)) - distance / distanceCoefficient + 'px';
    } else {
      leftStyle = parseInt(parentLeft.substring(0, parentLeft.length - 2)) + distance / distanceCoefficient + 'px';
    }

  }
  return createNewElement(value, topStyle, leftStyle);
}

function createNewElement(value: any, topStyle: string, leftStyle: string): HTMLElement {
  const newItem = document.createElement('div');
  newItem.className = "node";
  newItem.textContent = value;

  newItem.style.left = leftStyle;
  newItem.style.top = topStyle;

  if (sheets !== null) {
    sheets.append(newItem);
  }
  return newItem;
}

async function add() {
  const input = document.getElementById('value') as HTMLInputElement | null;
  const value = parseInt(<string>input?.value);

  // Если элемент уже есть в дереве - не добавляем
  if (tree !== null && tree.findNodeByValue(value) !== null) {
    return;
  }

  // Новыая нода со значением value
  let newNode: TreeNode<any> = new TreeNode<any>(value);

  // Если дерево пустое и значение валидное, то создаем новое дерево, где root = newNode
  if (tree === null && value !== null) {
    tree = new Tree<any>(newNode);
  } else {
    tree?.add(newNode)
  }

  // Показать путь
  await showPatch(value);

  // Рендерим новую ноду
  let elem: HTMLElement = render(newNode);
  // Добавляем отрендеренный HTML элемент в отображение TreeNode -> HTMLElement
  nodeToHtml.set(newNode, elem);
  // Подсвечиваем добавленную ноду
  markSheet(newNode);
  // Перерисовываем линии
  drawLines();
}

async function remove() {
  const input = document.getElementById('value') as HTMLInputElement | null;
  const value = parseInt(<string>input?.value);

  // Если значение отсутствует или дерево не построено, выходим из метода
  if (value === undefined || tree === null) {
    return;
  }
  // Находим ноду по значению
  let node: TreeNode<any> | null = tree.findNodeByValue(value);
  // Если нода отсутствует, то выходим из метода
  if (node == null) {
    return;
  }

  await showPatch(value);
  await markSheet(node);

  if (node.rightNode === null && node.leftNode !== null) {
    await markSheet(node.leftNode);
  } else if (node.rightNode !== null && node.leftNode === null) {
    await markSheet(node.rightNode);
  } else if (node.rightNode !== null && node.leftNode !== null) {
    let leftmostNode: TreeNode<any> = tree.getLeftmostSheetOf(node.rightNode);
    if (leftmostNode === null) {
      leftmostNode = node.rightNode;
    }
    await markSheet(node);
    await markSheet(leftmostNode);
  }

  tree.remove(value);
  await resetSheets();
  await drawLines();
}

function renderAll(node: TreeNode<any>) {
  // Рендерим ноду
  let elem: HTMLElement = render(node);
  // Заносим отрендеренный элемент в отображение
  nodeToHtml.set(node, elem);
  // Если нода имеет правую дочерную ноду, тоже рендерим
  if (node.rightNode !== null) {
    renderAll(node.rightNode);
  }
  // Если нода имеет левуб дочерную ноду, тоже рендерим
  if (node.leftNode !== null) {
    renderAll(node.leftNode);
  }
}

function resetSheets() {
  // @ts-ignore
  // Удаляем все листья
  sheets?.innerHTML = '';
  if (tree !== null && tree._root !== null) {
    // Рендерим, начиная с root
    renderAll(tree._root);
  }
}

async function search() {
  const input = document.getElementById('value') as HTMLInputElement | null;
  const value = parseInt(<string>input?.value);

  let node: TreeNode<any> | null | undefined = tree?.findNodeByValue(value);
  if (node === null || node === undefined) {
    return;
  }
  await markSheet(node);
}

function drawLines(): void {
  // @ts-ignore
  lines.innerHTML = '';
  for(var node of nodeToHtml.keys()) {
    if (node.rightNode !== null) {
      drawLine(nodeToHtml.get(node), nodeToHtml.get(node.rightNode));
    }
    if (node.leftNode !== null) {
      drawLine(nodeToHtml.get(node), nodeToHtml.get(node.leftNode));
    }
  }
}

function drawLine(from: HTMLElement | undefined, to: HTMLElement | undefined): void {
  if (from === undefined || to === undefined) {
    return;
  }
  const line = document.createElement('div');
  line.className = "line";
  line.style.zIndex = '-999';

  let fromTop: number = parseInt(from.style.top.substring(0, from.style.top.length - 2));
  let toTop: number = parseInt(to.style.top.substring(0, to.style.top.length - 2));
  let fromLeft: number = parseInt(from.style.left.substring(0, from.style.left.length - 2));
  let toLeft: number = parseInt(to.style.left.substring(0, to.style.left.length - 2));

  var upOrDown = 50;
  line.style.left = from.style.left;
  line.style.top =  fromTop + upOrDown + 'px';
  if (fromLeft > toLeft) {
    upOrDown = -50;
    line.style.left = to.style.left;
    line.style.top =  to.style.top + upOrDown + 'px';
  }

  let width: number = Math.sqrt(Math.pow(60, 2)
      + Math.pow(Math.abs(fromLeft - toLeft), 2));

  line.style.width = width + 'px';
  var rad = 60/(width - 20);
  if (upOrDown < 0) {
    rad = 3.1416 - rad;
  }
  line.style.transform = "rotate(" + rad + 'rad)';
  lines?.append(line);
}

async function markSheet(node: TreeNode<any>) {
  let element: HTMLElement | undefined = nodeToHtml.get(node);
  if (element === undefined) {
    return;
  }

  element.className += ' marked';
  element.style.backgroundColor = '#ef6351';
  let delayres = await delay(1000);
  element.style.backgroundColor = '#b2dbbf';
  element.className = 'node';
}

function delay(delayInms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, delayInms);
  });
}

async function showPatch(value: number) {
  if (tree != null) {
    let patch = tree.getPatchToNode(value);
    if (patch !== null) {
      for (const node of patch) {
        markSheet(node);
        let delayres = await delay(1000);
      }
    }
  }
}