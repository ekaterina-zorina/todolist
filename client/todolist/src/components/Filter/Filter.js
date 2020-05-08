import React from "react";
import "./Filter.css"

class Filter extends React.Component {
  handleSelectChange = (e) => {
    this.props.changeFilterValue(e.target.value);
  }

  filterTasks = async (e) => {
    e.preventDefault();
    let status = this.props.filterValue;
    this.props.getTasks(status);
  }

  render() {
    return (
      <div className="wrapper">
        <label htmlFor="filter">Filter by status:</label>

        <select id="filter"
                value={this.props.filterValue}
                onChange={this.handleSelectChange}>
          <option value="all">all</option>
          <option value="new">new</option>
          <option value="in progress">in progress</option>
          <option value="completed">completed</option>
          <option value="canceled">canceled</option>
        </select>

        <input className="btn"
               type="button"
               value="Search"
               onClick={this.filterTasks}/>
      </div>
    );
  }
}

export default Filter;