import React from 'react';
import {withStyles} from '@material-ui/core/styles'
import {Card, CardHeader, Divider, Button} from '@material-ui/core'
import RndContainer from '../Classroom_Components/RndContainer'
import {Stage, Layer, Text, Image} from 'react-konva'
import Rectangle from './Whiteboard_Components/Rectangle'
import TransformerComponent from './Whiteboard_Components/TransformerComponent'
import CanvasInsideWhiteboard from './Whiteboard_Components/CanvasInsideWhiteboard'
// import { SketchPicker } from 'react-color'
// import Portal from './Whiteboard_Components/Portal'
import {genid} from '../../interface/connection'

const styles = theme => ({
    card: {
        width: '100%',
        height: '100%'
    },
    avatar: {
        backgroundColor: "#769da8"
    },
    stage: {height: '800', width: '674'},
    panel: {
        width: '100%'
    }
})

function defaultText() {
    return {type: "text", x: 40, y: 40, text:"New Text\nwith Line Break", fontSize: 18, fontFamily: "Calibri", fill: 'blue', name: genid()}
}

function defaultRect() {
    return {type: "rectangle", x: 150, y: 150, width: 100, height: 100, fill: 'grey', name: genid()}
}

class Whiteboard extends React.Component {
    state = {
        permission: 'Read Only',
        objects: [{type: "whiteboard", name: "whiteboard"}],
        selectedShapeName: '',
        cursor: {x: null, y: null},
        image: null,
    }

    handleStageMouseDown = e => {
        console.log(this.state.test)
        // clicked on stage - clear selection
        if (e.target === e.target.getStage() || e.target.name === "whiteboard") {
            this.setState({selectedShapeName: ''})
            return
        }

        const name = e.target.name()
        const obj = this.state.objects.find(r => r.name === name)

        // clicked on transformer - do nothing
        if (e.target.getParent().className === 'Transformer') return
        if (obj) {this.setState({selectedShapeName: name})}
        else {this.setState({selectedShapeName: ''})}
    }

    handleZIndex = type => { // type = "top" || "bottom"
        const objName = this.state.selectedShapeName
        const obj = this.state.objects.find(r => r.name === objName)
        if (!obj) {
            this.props.handleNotification("No object selected!")
            return
        }
        this.state.objects.splice(this.state.objects.indexOf(obj), 1)
        if (type === "top") {
            this.setState({objects: [...this.state.objects, obj]})
        } else if (type === "bottom") {
            this.setState({objects: [obj, ...this.state.objects]})
        } else throw new Error("Invalid type for handleZIndex")
    }
    
    handleMouseMove = e => {
        var stage = e.currentTarget // same as: stage = this.stageRef.getStage(), or: stage = e.target.getStage()
        this.setState({ cursor: stage.getPointerPosition() })
        // console.log(this.state.cursor)
    }

    render() {
        const {classes, id, ...other} = this.props;
        return (
            <RndContainer id={id} {...other}>
                <Card className={classes.card}
                    onDragOver={() => console.log("onDragOver")} //!!! e.preventDefault()
                    onDrop={() => console.log("onDrop")} // e.preventDefault() then add image at pointer position
                >
                    <CardHeader //this height is 74px
                        title="Whiteboard"
                        subheader="Teacher"
                        id={`draggable${id}`}
                        style={{height: 50}}
                    />
                    <Divider/>
                    <div className={classes.panel}>
                        <Button onClick={()=> {
                            this.setState({objects: [...this.state.objects, defaultText()]})}}>
                            Add Text
                        </Button>
                        <Button onClick={()=> {
                            this.setState({objects: [...this.state.objects, defaultRect()]})}}>
                            Add Rect
                        </Button>
                        {/* <SketchPicker/> */}
                        <Button onClick={() => this.handleZIndex("top")}>
                            Bring Top
                        </Button>
                        <Button onClick={() => this.handleZIndex("bottom")}>
                            Bring Bottom
                        </Button>
                    </div>
                    <Divider/>
                    <Stage width={800} height={600}
                        ref={ref=>this.stageRef=ref}
                        onClick={()=>console.log(this.stageRef.getPointerPosition())}
                        // onDragMove = { () => {console.log("aaa")}}
                        onMouseMove={this.handleMouseMove}
                        onMouseDown={this.handleStageMouseDown}>
                        <Layer>
                            {this.state.objects.map((obj, i) => {
                                if (obj === undefined) console.log(obj)
                                else if (obj.type === "whiteboard")
                                    return <CanvasInsideWhiteboard key="whiteboard"/>
                                else if (obj.type === "rectangle") 
                                    return <Rectangle key={obj.name} {...obj}/>
                                else if (obj.type === "text") 
                                    return <Text key={obj.name} {...obj} draggable/>
                                else if (obj.type === "image") 
                                    return <Image />
                                return <Image />
                            })}
                            <TransformerComponent selectedShapeName={this.state.selectedShapeName}/>
                            
                            {/* <Image
                                image = {this.state.image}
                            /> */}
                            
                            {/* <Portal>
                                <input
                                    style={{
                                        position: 'absolute',
                                        top: 10,
                                        left: 10,
                                        width: '200px'
                                    }}
                                    placeholder="Some text here"
                                />
                            </Portal> */}
                        </Layer>
                    </Stage>
                </Card>
            </RndContainer>
        )
    }
}

export default withStyles(styles)(Whiteboard);
