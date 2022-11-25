'use strict';

const DefaultLeftWidth = 280;
const DefaultTopHeight = 50;
const DefaultSplit = " - ";
const Width = 1024;
const Height = 768 + 150;

/**
 * it will render a page by data
 * --------+-----------+-----------+------------
 *   logo  | catagory1 | catagory2 | catagory3
 * --------+------------------------------------
 *         |
 *   left  |              right
 *         |
 * --------+------------------------------------
 */
class myApp extends React.Component {

    /**
     * @param {*} props 
     * props.category: the selected category
     * props.topic: the selected topic in the selected category
     */
    constructor(props) {
        super(props);
        this.data = props.myData;

        // set windows' widht and height, and left's width
        this.totalWidth = Width; //window.innerWidth - 50;
        this.totalHeight = Height;//window.innerHeight;
        this.leftWidth = this.totalWidth * 0.2;
        if (this.leftWidth > DefaultLeftWidth) {
            this.leftWidth = DefaultLeftWidth;
        }

        let category = null;
        let topic = null;

        // process arguments category and topic, if provided
        if (this.data != null) {
            for(let i = 0;i<this.data.length;i++){
                if(this.data[i].category.title === props.category) {
                    category = this.data[i];
                    topic = category.topics[0];
                    for(let j = 0;j<category.topics.length;j++) {
                        if (category.topics[j].title === props.topic) {
                            topic = category.topics[j];
                        }
                    }
                }
            }
        }
        this.state = {
            selectCatetory: category,
            selectTopic: topic, 
            indexPage: category == null && topic == null
        }

        this.datalist = [];

        // initial the top logo and categories
        this.catetoryTds = []
        if (this.data != null && this.data.length > 0) {
            this.topicSpan = this.data.length + 1;
            let catetoryWidth = (this.totalWidth - this.leftWidth) / this.data.length;

            for(let i = 0; i < this.data.length; i++) {
                let category = this.data[i];
    
                let selectTopic = null;
                if (category != null && category.topics.length > 0) {
                    selectTopic = category.topics[0];
                    for(let j = 0;j<category.topics.length; j++) {
                        this.datalist.push(e('option', {}, category.category.title + DefaultSplit + category.topics[j].title));
                    }
                } 
    
                let categoryDiv = e('div', {onClick: () => {
                    this.setState({
                        "selectCatetory": category,
                        "selectTopic" : selectTopic,
                        "indexPage" : false
                    });
                }}, e('h2', {}, category.category.title));
                
                let td = e('td', {"width": catetoryWidth, "height": DefaultTopHeight - 30}, categoryDiv);
                this.catetoryTds.push(td);
            }
        } else {
            this.topicSpan = 1;
            this.catetoryTds.push(e('td', {"width": this.totalWidth - this.leftWidth, "height": DefaultTopHeight - 30, "colspan": this.topicSpan}, e(DefaultImage)))
        }
    }

    searchText(key) {
        if (key.indexOf(DefaultSplit) > -1){
            let categoryString = key.substring(0, key.indexOf(DefaultSplit));
            let content = key.substring(categoryString.length + DefaultSplit.length, key.length);
            for(let i = 0; i< this.data.length; i++) {
                let category = this.data[i];
                if (category.category.title === categoryString) {
                    for(let j = 0;j<category.topics.length; j++){
                        if(category.topics[j].content.indexOf(content) > -1 || category.topics[j].title.indexOf(content) > -1) {
                            return {"selectTopic": category.topics[j], "selectCatetory": category, "indexPage": false};
                        }
                    }
                    return {"selectTopic": null, "selectCatetory": category, "indexPage": false};
                }
            }
        }
        return {"selectTopic": null, "selectCatetory": null, "indexPage": true};
    }

    render() {
        let left = [e('td', {})]
        if (this.state.selectCatetory != null){
            let lis = []
            let topics = this.state.selectCatetory.topics;
            for (let i = 0; i < topics.length; i++) {
                let topic = this.state.selectCatetory.topics[i];
                let topicText = topic.title;
                if (topic == this.state.selectTopic) {
                    topicText = e('b', {}, topicText);
                }
                let li = e('li', {onClick: () => {
                    this.setState({
                        "selectTopic": topic,
                        "indexPage": false
                    });
                }}, topicText);
                lis.push(li);
            }
            left = [
                e('td', {"valign": "top", "align": "left", "bgcolor" : "#eeeeee"}, [
                    e('br'),e('br'),
                    e('ur', {}, lis),
                    e('br'),e('br'),
                ])
            ];
        }

        let right = e('td', {"colspan": this.topicSpan});
        if (this.state.selectTopic != null) {
            let psArray = this.state.selectTopic.content.split('\n');
            let ps = []
            for(let i = 0; i < psArray.length; i++) {
                if(psArray[i].length > 0) {
                    ps.push(e('p', {}, psArray[i]));
                }
            }
            if (this.state.selectTopic.image === "") {
                right = e('td', {"colspan": this.topicSpan, "valign": "top"}, e('div', {}, [
                    e('hr'),
                    e('h3', {}, this.state.selectTopic.title),
                    e('div', {"align": "left"}, ps),
                    e('hr')
                ]));
            } else {
                right = e('td', {"colspan": this.topicSpan, "valign": "top"}, e('div', {}, [
                    e('hr'),
                    e('h3', {}, this.state.selectTopic.title),
                    e('img', {"src" : this.state.selectTopic.image, "width": this.totalWidth - this.leftWidth - 100}),
                    e('div', {"align": "left"}, ps),
                    e('hr')
                ]));
            }
            
        }

        let central = e('tr', {"align": "center"}, [left, right]);
        if (this.state.indexPage) {
            central = e('tr', {"class":"bg"}, e('td', {"colspan": this.topicSpan + 1, "align": "left"}));
        }
        
        return e('div', {},
                e('table', {"border": 0, "width": this.totalWidth, "height": this.totalHeight - DefaultTopHeight, "align": "center"}, 
                    [e('tr', {"align": "center", "height": DefaultTopHeight}, [
                        e('td', {"width": this.leftWidth, "rowspan" : 2}, e('a', {"href" : "index.html"}, e('img', {"src":"images/logo.png"}))),
                        e('td', {"colspan": this.topicSpan, "align": "right", "width": this.totalWidth - this.leftWidth}, [
                                e('input', {onChange: (event) => {
                                    let v = event.target.value;
                                    let result = this.searchText(v);
                                    this.setState(result);
                                },
                                "list" : "searchList", "size": 40, "border-color": "#10253F"}),
                                e('datalist', {"id": "searchList"}, this.datalist)
                            ])]),
                     e('tr', {"align": "center"}, this.catetoryTds),
                     central,
                     e('tr', {"height": 10}, e('td', {"colspan": this.topicSpan + 1, "align": "center"}, [
                         e('font', {"size" : +2}, "2022")
                        ]
                      )
                    )
                    ]
                )
            );
    }
}

class DefaultImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultImg : props.defaultImage
        }
    }

    render() {
        return e('div', {}, "");
    }
}

const e = React.createElement;
const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(e(myApp, {"myData": appData}));