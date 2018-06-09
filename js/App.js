window.ee = new EventEmitter();

var my_news = [
  {
    author: 'Саша Печкин',
    title: 'В четчерг, четвертого числа...',
    text: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
  },
  {
    author: 'Просто Вася',
    title: 'Считаю, что $ должен стоить 35 рублей!',
    text: 'А евро 42!'
  },
  {
    author: 'Гость',
    title: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
    text: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
  }
];

var Article = React.createClass({
    propTypes: {
      data: React.PropTypes.shape({
          author: React.PropTypes.string.isRequired,
          title: React.PropTypes.string.isRequired,
          text: React.PropTypes.string.isRequired
      })  
    },
    
    getInitialState: function() {
        return {
          visible: false
        };
    },
    
    viewText: function(e) {
        e.preventDefault();
        this.setState({visible: true});
    },
    
   render: function(){
//       console.log("render");
       var item  = this.props.data;
       var visible = this.state.visible;
       return (
           <div className="article">
                <strong > 
                    <p className = "news_author" > {item.author}: < /p> 
                </strong >
                <p className = "news_text" > {item.title} < /p> 
                <a href="#" 
                    onClick={this.viewText} 
                    className={'news_readmore ' + (visible ? 'none': '')}>
                    Подробнее
                </a>
                <p className = {'news_big-text ' + (visible ? '': 'none')} > {item.text} < /p> 
           </div>
        );
   } 
});

var News = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    getInitialState: function() {
        return {
            counter: 0
        }
    },
    render: function () {
        var data = this.props.data;
        var newsTemplate;
        
        if (data.length > 0) {
            newsTemplate = data.map((item, index) => ( 
                    <Article data={item} key={index}/>
            ))
        } else {
            newsTemplate = <p> К сожалению новостей нет! </p>
        }
        
        return ( 
            <div className = "news" > 
                {newsTemplate} 
                <strong
                    className={'news_count ' + (data.length>0 ? '':'none')}> 
                        Всего новостей: {data.length} 
                < /strong> 
            </div>
        );
    }
});

var Add = React.createClass({
  getInitialState: function() { //устанавливаем начальное состояние (state)
    return {
      agreeNotChecked: true,
      authorIsEmpty: true,
      titleIsEmpty: true,
      textIsEmpty: true    
    };
  },
  componentDidMount: function() {
    ReactDOM.findDOMNode(this.refs.author).focus();
  },
  onBtnClickHandler: function(e) {
    e.preventDefault();
    var author = ReactDOM.findDOMNode(this.refs.author);
    var title = ReactDOM.findDOMNode(this.refs.title);
    var text = ReactDOM.findDOMNode(this.refs.text);  
    var checkbox = ReactDOM.findDOMNode(this.refs.checkrule);
    if(window.confirm("Are you sure?")){
        var item = [{
           author: author.value,
           title: title.value,
           text: text.value
        }];
        window.ee.emit('News.add', item);
        author.value = '';
        title.value = '';
        text.value = '';
        checkbox.checked = false;
        this.setState({
            textIsEmpty: true,
            titleIsEmpty: true,
            authorIsEmpty: true,
            agreeNotChecked: !this.state.agreeNotChecked
        });
    }
  },
  onCheckRuleClick: function(e) {
    this.setState({agreeNotChecked: !this.state.agreeNotChecked}); //устанавливаем значение в state
  },
  onFieldChange: function(fieldName, e) {
    if (e.target.value.trim().length > 0) {
      this.setState({['' + fieldName]: false})
    } else {
      this.setState({['' + fieldName]: true})
    }
  },
  render: function() {
    var agreeNotChecked = this.state.agreeNotChecked,
        authorIsEmpty = this.state.authorIsEmpty,
        textIsEmpty = this.state.textIsEmpty,
        titleIsEmpty = this.state.titleIsEmpty;
    return (
      <form className='add cf'>
        <input
          type='text'
          className='add__author'
          onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
          placeholder='Ваше имя'
          ref='author'
        />
        <input
          type='text'
          className='add__title'
          onChange={this.onFieldChange.bind(this, 'titleIsEmpty')}
          placeholder='Название новости'
          ref='title'
        />
        <textarea
          className='add__text'
          onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
          placeholder='Текст новости'
          ref='text'
        ></textarea>
        <label className='add__checkrule'>
          <input type='checkbox' ref='checkrule' onChange={this.onCheckRuleClick}/>Я согласен с правилами
        </label>

        <button
          className='add__btn'
          onClick={this.onBtnClickHandler}
          ref='alert_button'
          disabled={agreeNotChecked || authorIsEmpty || textIsEmpty || titleIsEmpty}
          >
          Добавить новость
        </button>
      </form>
    );
  }
});
var App = React.createClass({
    getInitialState: function() {
        return {
          news: my_news
        };
    },
    componentDidMount: function() {
        var self = this;
        window.ee.addListener('News.add', function(item){
//            console.log("New news");
           var nextNews = item.concat(self.state.news);
            self.setState({news: nextNews});
        });
    },
    componentWillUnmount: function() {
        window.ee.removeListener('News.add');
    },
    render: function () {
        return ( 
            <div className = "app" >
                <Add/>
                <h3> Новости! </h3> 
                <News data={this.state.news}/> 
            </div>
        );
    }
});

ReactDOM.render( 
    <App / > ,
    document.getElementById('root')
);
