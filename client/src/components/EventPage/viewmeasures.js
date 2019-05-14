import React, { Component } from "react";
import API from "../../utils/API";
import ReactTable from "react-table";
import matchSorter from "match-sorter";
import { BrowserRouter as Router, Link, } from "react-router-dom";
import io from "socket.io-client";
const uuidv4 = require("uuid/v4");

class ViewMeasures extends Component {
  constructor(){
    super()
    this.state = {
      measures: []
    }
    const getMeasures = this.getMeasures.bind(this)
    this.socket = io("localhost:3001")

    this.socket.on("RECEIVE_MESSAGE", function(data){
      let eventId = data.eventId
      setTimeout(getMeasures, 1000, eventId)
      
  })
  }
  componentDidMount = ()=>{
    this.getMeasures(this.props.eventId)
  }
  componentWillUnmount = ()=>{
    // clearInterval(pullEventsInterval)
  }
  getMeasures = (eventId) =>{
    //pull all measures for the current event
    API.getMeasuresByEvent(eventId)
      .then(res =>{
        //if there are new measures, then update the measures state
        if (res.data.length > this.state.measures.length){
          this.setState({
            measures: res.data
          })
        }
      })
  }
  
    render() {
      const columns = [
        {
            Header: "Name",
            accessor: "name",
            filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["name"] }),
                filterAll: true,   
        },
        {
            Header: "Measure Type",
            id: "measureType",
            accessor: "measureType",
            filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["checkedIn"] }),
                filterAll: true,   
        },
        {
            Header: "Result",
            id: "result",
            accessor: measure => {
                if(measure.result){
                    return "Passed!"
                }
                else{
                    return "Failed"
                }
            }, filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["schoolName"] }),
                filterAll: true,
        },{
          Header: "Measure Detail",
          id: "measureDetail",
          accessor: measure =>{
            return <Link to={{ pathname: `/measure/${measure.id}` }}>View detail</Link>
          }
        }
    ]
      
        return (
          <ReactTable data={this.state.measures} columns={columns} defaultPageSize={10} filterable
          defaultFilterMethod={(filter, row) => String(row[filter.id]) === filter.value}  minRows={0} 
          />
        );
    }
}

export default ViewMeasures;