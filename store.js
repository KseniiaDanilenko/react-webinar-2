class Store {

  constructor(initState) {
    // Состояние приложения (данные)
    this.state = initState;
    // Слушатели изменений state
    this.listeners = [];
    
  }

  /**
   * Выбор state
   * @return {Object}
   */
  getState() {
    return this.state;
  }


  /**
   * Установка state
   * @param newState {Object}
   */
  setState(newState) {
    this.state = newState;
    // Оповещаем всех подписчиков об изменении стейта
    for (const listener of this.listeners) {
      listener();
    }
  }



  /**
   * Подписка на изменение state
   * @param callback {Function}
   * @return {Function} Функция для отписки
   */
  subscribe(callback) {
    this.listeners.push(callback);
    // Возвращаем функцию для удаления слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== callback);
    }
  }

  /**
   * Создание записи
   */
  createItem({code, title = 'Новый товар', price = 999, selected = false}) {
    this.setState({
      ...this.state,
      items: this.state.items.concat({code, title, price, selected})
    });
  }


  /**
   * Удаление записи по её коду
   * @param code
   */
  deleteItem(code) {
    this.setState({
      ...this.state,
      items: this.state.items.filter(item => item.code !== code)
    });
  }

 
  addToCart(item){
    const uniqueItems = this.state.cart.find((element) => element.code === item.code);
    if(uniqueItems) {
      this.setState({
        ...this.state,
        cart: this.state.cart.map((element) => {
        if (element.code === item.code) {
          return {...uniqueItems, count: ++uniqueItems.count}; 
        } else{
          return element;
        } 
        })
      })
    }else {
      this.setState({
        ...this.state,
        cart: [...this.state.cart, {...item, count: 1}]
      });
    }
    this.setState({
      ...this.state,
      totalCount: this.state.cart.reduce((counter, item)=>{        
        return counter+=item.count;        
      },0),
      totalPrice: this.state.cart.reduce((counter, item)=>{        
        return counter +=(item.price * item.count)       
      },0),
      uniqueItemsCount: this.state.cart.reduce((counter, item)=>{        
        if(item){
          return ++counter;
        }       
      },0),
    });    
    
  }

  deleteFromCart(item){
    this.setState({
      ...this.state,
      cart: this.state.cart.filter(element => element.code !== item.code)   
    });
    this.setState({
      ...this.state,
      totalCount: this.state.cart.reduce((counter, item)=>{        
        return counter+=item.count;        
      },0),
      totalPrice: this.state.cart.reduce((counter, item)=>{        
        return counter +=(item.price * item.count)       
      },0),
      uniqueItemsCount: this.state.cart.reduce((counter, item)=>{        
        if(item){
          return ++counter;
        }       
      },0),
    });
  }

  }
 
 


export default Store;
