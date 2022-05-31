import {TreeNode} from "./node";

export class Tree<T> {
  public _root: TreeNode<T>;

  constructor(root: TreeNode<T>) {
    this._root = root;
  }

  add(node: TreeNode<T>): void {
    this.addRecursive(node, this._root);
  }

  addRecursive(newNode: TreeNode<T>, parent: TreeNode<T>): void {
    if (newNode.value < parent.value) {
      if (parent.leftNode !== null) {
        this.addRecursive(newNode, parent.leftNode);
      } else {
        parent.leftNode = newNode;
      }
    } else {
      if (parent.rightNode !== null) {
        this.addRecursive(newNode, parent.rightNode);
      } else {
        parent.rightNode = newNode;
      }
    }
  }

  findNodeByValue(value: T): TreeNode<T> | null {
    let currentNode: TreeNode<T> | null = this._root;

    while(currentNode !== null && currentNode.value !== value) {
      if (value < currentNode.value) {
        currentNode = currentNode.leftNode;
      } else {
        currentNode = currentNode.rightNode;
      }
    }
    if (currentNode === null) {
      return null;
    } else {
      return currentNode;
    }
  }

  getPatchToNode(value: T): TreeNode<T>[] | null {
    let path: TreeNode<T>[] = [];
    let currentNode: TreeNode<T> | null = this._root;

    while(currentNode !== null && currentNode.value !== value) {
      path.push(currentNode);
      if (value < currentNode.value) {
        currentNode = currentNode.leftNode;
      } else {
        currentNode = currentNode.rightNode;
      }
    }
    if (currentNode === null) {
      return null;
    } else {
      return path;
    }
  }

  remove(value: T): boolean {
    let currentNode: TreeNode<T> | null = this._root;
    let parentNode: TreeNode<T> | null = this._root;

    while(currentNode !== null && currentNode.value !== value) {
      parentNode = currentNode;
      if (value < currentNode.value) {
        currentNode = currentNode.leftNode;
      } else {
        currentNode = currentNode.rightNode;
      }
    }

    if (currentNode === null) {
      return false;
    } else {
      // У удаляемого элемента нет потомков
      if (currentNode.leftNode === null && currentNode.rightNode === null) {
        if (value < parentNode.value) {
          parentNode.leftNode = null;
        } else {
          parentNode.rightNode = null;
        } // У удаляемого элемента один потомок
      } else if (currentNode.leftNode !== null && currentNode.rightNode === null) {
        if (value < parentNode.value) {
          parentNode.leftNode = currentNode.leftNode;
        } else {
          parentNode.rightNode = currentNode.leftNode;
        }
      } else if (currentNode.leftNode === null && currentNode.rightNode !== null) {
        if (value < parentNode.value) {
          parentNode.leftNode = currentNode.rightNode;
        } else {
          parentNode.rightNode = currentNode.rightNode;
        }
      } else if (currentNode.leftNode !== null && currentNode.rightNode !== null) {
        // У удалямоего элемента два потомка.
        // Если справа нет левых
        if (currentNode.rightNode.leftNode === null) {
          if (value < parentNode.value) {
            // На место удаленного присваеваем правый удаленного
            parentNode.leftNode = currentNode.rightNode;
            // В присвоенном левая нода такая же, как у удаленного
            parentNode.leftNode.leftNode = currentNode.leftNode;
          } else {
            // На место удаленного присваеваем правый удаленного
            parentNode.rightNode = currentNode.rightNode;
            // В присвоенном левая нода такая же, как у удаленного
            parentNode.rightNode.leftNode = currentNode.leftNode;
          }
        } else {
          let leftNode: TreeNode<T> = currentNode.rightNode.leftNode;

          let leftmostNode: TreeNode<T> = this.getLeftmostSheetOf(leftNode);
          let leftmostParent: TreeNode<T> | undefined = this.getPatchToNode(leftmostNode.value)?.at(-1);
          if (leftmostParent !== undefined) {
            leftmostParent.leftNode = leftmostNode.rightNode;
          }
          if (value < parentNode.value) {
            parentNode.leftNode = leftmostNode;
          } else {
            parentNode.rightNode = leftmostNode;
          }
          leftmostNode.rightNode = currentNode.rightNode;
          leftmostNode.leftNode = currentNode.leftNode;
        }
      }
      return true;
    }
  }

  private removeLeftmostSheetOf(node: TreeNode<T>): TreeNode<T> {
    let nodeToRemove: TreeNode<T> = this.getLeftmostSheetOf(node);

    this.remove(nodeToRemove.value);

    return nodeToRemove;
  }

  public getLeftmostSheetOf(node: TreeNode<T>): TreeNode<T> {
    let current: TreeNode<T> | null = node;

    while(current.leftNode !== null) {
      current = current.leftNode;
    }
    return current;
  }
}