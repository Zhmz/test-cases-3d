import { _decorator, Component, Node, Prefab, instantiate, Widget, Sprite, Color, Texture2D, SpriteFrame, Label, UITransform, Button, EditBox, find } from "cc";
const { ccclass, property , menu} = _decorator;

@ccclass("WidgetPreformance")
@menu('UI/WidgetPreformance')
export class WidgetPreformance extends Component {

    @property(Prefab)
    public performancePrefab: Prefab = null!;
    @property(SpriteFrame)
    public bgTex: SpriteFrame = null!;
    @property(Label)
    public countLabel: Label = null!;
    @property(Button)
    public confirmButton: Button = null!;
    @property(EditBox)
    public editBox: EditBox = null!;

    public nodeA: Node = null!;

    start () {
        this.confirmButton.node.on('click',this.onRefreshNode,this);

        this.onGenerateNode(500);
        this.refreshCountLabel(500);
    }

    onRefreshNode() {
        const countStr = this.editBox.string;
        const count = Number(countStr);
        if(!count) {
            this.countLabel.string = '输入不合法';
        } else {
            this.onGenerateNode(count);
            this.refreshCountLabel(count);
        }
    }
    
    refreshCountLabel (count:number) {
        this.countLabel.string = `当前节点数量 ${count}`;
    }

    onGenerateNode(count:number) {
        const parent = find('canvas/widget-performance');
        if(parent) {
            parent.destroy();
            console.log('parent is destroyed.');
        }

        let i = 0;
        this.nodeA = instantiate(this.performancePrefab);
        this.node.addChild(this.nodeA);
        const sprite = this.nodeA.getComponent(Sprite)!;
        sprite.spriteFrame = this.bgTex;
        const arr = [true, false];
        for (i = 0; i < count; i++) {
            const child = instantiate(this.performancePrefab) as Node;
            child.name = `layer_${i + 1}`;
            this.nodeA.addChild(child);
            const childWidgetComp = child.getComponent(Widget)!;
            childWidgetComp.isAlignTop = true;
            let bol = arr[Math.floor(Math.random() * arr.length)];
            childWidgetComp.isAlignLeft = bol;
            bol = arr[Math.floor(Math.random() * arr.length)];
            childWidgetComp.isAlignBottom = true;
            childWidgetComp.isAlignRight = bol;
            childWidgetComp.top = 0;
            childWidgetComp.left = Math.random()*200;
            childWidgetComp.bottom = 0;
            childWidgetComp.right = Math.random() * 150;
            const renderComp = child.getComponent(Sprite)!;
            renderComp.color = new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255);
        }

        this.schedule(this.adjustWidget,2);
    }

    onDisable () {
        this.unschedule(this.adjustWidget);
    }

    adjustWidget () {
        const uiTrans = this.nodeA.getComponent(UITransform)!;
        const size = uiTrans.contentSize;
        uiTrans.setContentSize(size.width, Math.random() * 200);
    }
}
