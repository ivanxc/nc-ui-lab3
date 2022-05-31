export class TreeNode<T> {
  private _value: T;
  private _leftNode: TreeNode<T> | null;
  private _rightNode: TreeNode<T> | null;

  constructor(value: T) {
    this._value = value;
    this._leftNode = null;
    this._rightNode = null;
  }

  get value(): T {
    return this._value;
  }

  set value(value: T) {
    this._value = value;
  }

  get leftNode(): TreeNode<T> | null {
    return this._leftNode;
  }

  set leftNode(value: TreeNode<T> | null) {
    this._leftNode = value;
  }

  get rightNode(): TreeNode<T> | null {
    return this._rightNode;
  }

  set rightNode(value: TreeNode<T> | null) {
    this._rightNode = value;
  }
}