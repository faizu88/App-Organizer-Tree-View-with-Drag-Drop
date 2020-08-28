import {Component, ViewChild} from '@angular/core';
import {ITreeOptions, ITreeState, TREE_ACTIONS, TreeComponent} from '@circlon/angular-tree-component';
import {v4} from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public treenodes = [
    {
      id: 1,
      name: 'App 1',
      children: [
        {name: 'App 2'},
        {name: 'App 3'}
      ]
    },
    {
      name: 'App 4',
      id: 2,
      children: [
        {name: 'App 5', children: []},
        {
          name: 'App 6',
          id: 3,
          children: [
            {name: 'App 7'}
          ]
        }
      ]
    },
    {name: 'App 8'},
    {name: 'App 9', children: []},
    {name: 'App 10'}
  ];
  public appCards = Array.from({length: 25}).map((_, index) => ({id: v4(), name: 'App' + (index + 11)}));
  public state: ITreeState = {expandedNodeIds: {1: true, 2: true, 3: true}, hiddenNodeIds: {}, activeNodeIds: {}};
  public options: ITreeOptions = {
    allowDrag: true,
    actionMapping: {
      mouse: {
        drop: this.onDrop.bind(this),
        dblClick: (tree, node, $event) => {
          if (node.hasChildren) {
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          }
        },
      }
    }
  };
  @ViewChild(TreeComponent) tree: TreeComponent;

  onDrop(tree, node, $event, {from, to}) {
    if (from.constructor.name === 'TreeNode') {
      // Internal Node Drop
      TREE_ACTIONS.MOVE_NODE(tree, node, $event, {from, to});
    } else {
      // External Node Drop
      node.data.children = node.data.children ? node.data.children : [];
      node.data.children.splice(to.index, 0, from);
      this.appCards.splice(this.appCards.findIndex(card => card.id === from.id), 1);
      this.tree.treeModel.update();
    }
  }

  onAppDrop(event) {
    if (event.element.constructor.name === 'TreeNode') {
      const node = this.tree.treeModel.getNodeById(event.element.data.id);
      // Prevent dragging folder with child node(s)
      if (node.data.children && node.data.children.length) {
        return;
      }
      const nodeParentData = node.parent.data;
      const treeNodeIndex = nodeParentData.children.findIndex((child) => child.id === node.data.id);
      nodeParentData.children.splice(treeNodeIndex, 1);
      this.tree.treeModel.update();
      this.appCards.unshift(event.element.data);
    }
  }

  onMoveNode(event) {
    // Can call API here if needed (Save)
  }
}
