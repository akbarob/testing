import React from "react";
import Menu from "./MenuComponent";
import DishDetail from "./DishdetailComponent";
import Home from "./HomeComponent";
import Header from "./HeaderComponent";
import Footer from "./FooterComponent";
import Contact from "./ContactComponent";
import About from "./AboutComponent";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addComment } from "../redux/ActionCreators";

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    leaders: state.leaders,
    comments: state.comments,
    promotions: state.promotions
  };
};

const mapDispatchToProps = dispatch => ({
  addComment: (dishId, rating, author, comment) =>
    dispatch(addComment(dishId, rating, author, comment))
});

const HomePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ dishes, leaders, promotions }) => {
  return (
    <Home
      dish={dishes.filter(dish => dish.featured)[0]}
      leader={leaders.filter(leader => leader.featured)[0]}
      promotion={promotions.filter(promo => promo.featured)[0]}
    />
  );
});

const DishWithId = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ match, addComment, comments, dishes }) => {
  return (
    <>
      Comments total {comments.length}
      <p>
        Comments on this dish
        {comments.filter(c => c.dishId === 0).length}
      </p>
      <DishDetail
        dish={
          dishes.filter(
            dish => dish.id === parseInt(match.params.dishId, 10)
          )[0]
        }
        comments={comments.filter(
          comment => comment.dishId === parseInt(match.params.dishId, 10)
        )}
        addComment={addComment}
      />
    </>
  );
});

class Main extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route path="/home" component={HomePage} />
          <Route
            exact
            path="/aboutus"
            component={() => <About leaders={this.props.leaders} />}
          />
          <Route
            exact
            path="/menu"
            component={() => <Menu dishes={this.props.dishes} />}
          />
          <Route path="/menu/:dishId" component={DishWithId} />
          <Route exact path="/contactus" component={() => <Contact />} />
          <Redirect to="/home" />
        </Switch>
        <Footer />
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Main)
);
