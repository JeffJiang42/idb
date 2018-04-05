import JobCard from './JobCard.jsx';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Collapse} from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Select from "react-virtualized-select";

var card_remove_border = {
    'borderStyle': 'none'
};

const providers = ["Authentic Jobs", "GitHub Jobs"]
const sortQueries  = ["name", "name&desc=TRUE", "company", "company&desc=TRUE", "provider", "provider&desc=TRUE", "location", "location&desc=TRUE", "num-related-courses", "num-related-courses&desc=TRUE"]
const numCourse = ["0..200", "200..400", "400..600", "600..800", "800..1000", "1000..1200", "1200..1400"]
const jobType = ["Part-time","Full-time","Contract"]

class Jobs extends Component{
  constructor(props){
    super(props)
    this.state = {
      jobList: [],
      page: 1,
      pageSize: 32,
      maxPage: 10,
      sortOpen: false,
      filterOpen: false,
      queries: [],
      sortOption: '',
      providerOption: '',
      locationOptions: '',
      locationList:'',
      locationNames:'',
      companyList:[],
      companyNames: '',
      companyOption: '',
      typeOption:''
    }
    this.handlePageChange = this.handlePageChange.bind(this)
    this.makeQuery = this.makeQuery.bind(this)
    this.sortChange = this.sortChange.bind(this)
    this.numCourseChange = this.numCourseChange.bind(this)
    this.providerChange = this.providerChange.bind(this)
    this.getFilters = this.getFilters.bind(this)
    this.companyChange = this.companyChange.bind(this)
    this.typeChange = this.typeChange.bind(this)
    this.locationChange = this.locationChange.bind(this)
  }

  typeChange(choice){
    this.setState({typeOption: choice})
    console.log(choice)
    if (choice != null){
      this.state.queries.jobType = ("jobtype=" + jobType[choice-1])
    }
    else{
      delete this.state.queries.jobType
    }
    this.makeQuery()
  }

  locationChange(choice){
    this.setState({locationOption: choice})
    //console.log(choice)
    var choiceArr = choice.split(',')
    //console.log(choiceArr)
    choiceArr = choiceArr.map((a) => {return encodeURI(this.state.locationNames[parseInt(a)-1])})
    //console.log(choiceArr)
    if (!(choiceArr.includes(NaN) || choice == '' || choice == null)){
      this.state.queries.locations = ''
      for (let c in choiceArr) {
        this.state.queries.locations += 'location=' + choiceArr[c]
        if (c < choiceArr.length -1){
          this.state.queries.locations += '&'
        }
      }
      console.log(this.state.queries)
    }
    else{
      delete this.state.queries.locations
    }
    this.makeQuery()
  }

  companyChange(choice){
    this.setState({companyOption: choice})
    //console.log(choice)
    var choiceArr = choice.split(',')
    //console.log(choiceArr)
    choiceArr = choiceArr.map((a) => {return encodeURI(this.state.companyNames[parseInt(a)-1])})
    //console.log(choiceArr)
    if (!(choiceArr.includes(NaN) || choice == '' || choice == null)){
      this.state.queries.companies = ''
      for (let c in choiceArr) {
        this.state.queries.companies += 'company=' + choiceArr[c]
        if (c < choiceArr.length -1){
          this.state.queries.companies += '&'
        }
      }
      console.log(this.state.queries)
    }
    else{
      delete this.state.queries.companies
    }
    this.makeQuery()
  }

  providerChange(choice){
    this.setState({providerOption: choice})
    var choiceArr = choice.split(',')
    choiceArr = choiceArr.map((a) => {return encodeURI(providers[parseInt(a)])})
    console.log(choiceArr)
    if (!(choiceArr.includes(NaN) || choice == '' || choice == null)){
        this.state.queries.providers = ''
        for (let c in choiceArr){
          console.log('Choices ' + choiceArr[c])
          this.state.queries.providers += 'provider=' + choiceArr[c]
          if (c < choiceArr.length -1){
            this.state.queries.providers += '&'
          }
        }
    console.log(this.state.queries)
    }
    else{
      delete this.state.queries.providers
    }
    this.makeQuery()
  }

  sortChange(choice){
    this.setState({sortOption: choice})
    //console.log(this.state.queries)
    if(choice != null){
      this.state.queries.sort = ("sort_by=" + sortQueries[choice-1])
      //console.log(this.state.queries)
    }
    else{
      delete this.state.queries.sort
    }
    this.makeQuery()
  }

  numCourseChange(choice){
    this.setState({numCourseOption: choice})
    if (choice != null){
      this.state.queries.numCourse = ("num-related-courses=" + numCourse[choice-1])
    }
    else{
      delete this.state.queries.numCourse
    }
    this.makeQuery()
  }

  makeQuery(){
    var url = 'http://api.learning2earn.me/jobs'
    var first = true
    var queries = this.state.queries
    console.log(queries)
    for (let key in queries){
      if (first){
        url += '?' + queries[key]
        first = false
      }
      else{
        url += '&' + queries[key]
      }
    }
    console.log(url)
    fetch(url)
      .then((response) => {return response.json()})
      .then((json) => {
        var sorted = json
        this.setState({jobList: sorted, page: 1, maxPage: Math.ceil(sorted.length / this.state.pageSize)})
      })
  }

  getFilters(name){
    var filters = new Set()
    for (let job of this.state.jobList){
      filters.add(job[name])
    }
     return Array.from(filters).map((name,i) => { return {label: name, value: i+1} })
  }

  handlePageChange(event){
    this.setState({page: Number(event.selected+1)})
  }

  componentWillMount(){
    const rehydrate = JSON.parse(localStorage.getItem('jobSavedState'))
    this.setState(rehydrate)
    this.setState({sortOption:''})
    const url = 'http://api.learning2earn.me/jobs';
    fetch(url)
      .then((response) => {return response.json()})
      .catch((error) => {console.log(error.message)})
      .then((info) => {this.setState({jobList: info, maxPage: Math.ceil(info.length / this.state.pageSize)},
        () => {this.state.companyList = this.getFilters("company");
          this.state.companyNames = this.state.companyList.map((dict)=>{return dict["label"]})
          this.state.locationList = this.getFilters("location")
          this.state.locationNames = this.state.locationList.map((dict)=>{return dict["label"]})
        })})
      .catch((error) => {console.log(error.message)})
  }


  componentWillUnmount(){
    var toSave = {
      page: this.state.page,
      sortOption: this.state.sortOption
    };
    localStorage.setItem('jobSavedState', JSON.stringify(toSave))
  }

  render(){
    const providerOptions = [{label: "Authentic Jobs", value: 1}, {label: "GitHub Jobs", value: 2}]
    const  numCourseOptions = [{label: "between 0 and 200 courses", value: 1},{label: "between 200 and 400 courses", value: 2},
    {label: "between 400 and 600 courses", value: 3}, {label: "between 600 and 800 courses"}, {label: "between 800 and 1000 courses", value: 4},
    {label: "between 1000 and 1200 courses", value: 5}, {label: "between 1200 and 1400 courses", value: 6}]
    const sortOptions=[{label: "Name (alphabetical)",  value: 1}, {label: "Name (Descending alphabetical)", value: 2},
    {label: "Company (alphabetical)", value: 3}, {label: "Company (Descending alphabetical)", value: 4},
    {label: "Provider (alphabetical)", value: 5}, {label: "Provider (Descending alphabetical)", value: 6},
    {label: "Location (alphabetical)", value: 7}, {label: "Location (Descending alphabetical)", value: 8},
    {label: "Number of courses", value: 9}, {label: "Number of courses (Descending)", value: 10}]
    const  typeOptions = [{label:"Part-time", value: 1},{label: "Full-time", value: 2}, {label: "Contract", value: 3}]
    const companyOptions = this.state.companyList
    const locationOptions = this.state.locationList

    var {jobList, page, pageSize, maxPage} = this.state
    var lastInd = page * pageSize
    var firstInd = lastInd - pageSize
    var jobArr = jobList.slice(firstInd, lastInd)
    var jCards = jobArr.map((job,i) =>
      <div className='col-sm-3' key={i}>
        <div className='card' style={card_remove_border}>
          <JobCard jobId={job.id} name={job.name} company={job.company} image={job.image} provider={job.provider} numCourses={job['num-related-courses']} jobType={job.jobtype} location={job.location}/>
        </div>
      </div>
    )
    return(
      <div className='box'>
        <div className='Filters'>
          <h1 onClick={() => this.setState({filterOpen: !this.state.filterOpen})}>Filters</h1>
          <br />
          <Collapse in={this.state.filterOpen}>
            <div>
              <Select multi options={companyOptions} simpleValue value={this.state.companyOption} placeholder='Company' onChange={this.companyChange} />
              <Select multi options={locationOptions} simpleValue value={this.state.locationOption} placeholder='Location' onChange={this.locationChange} />
              <Select multi options={providerOptions} simpleValue value={this.state.providerOption} placeholder='Provider' onChange={this.providerChange} />
              <Select options={numCourseOptions} simpleValue value={this.state.numCourseOption} placeholder='Number of related courses' onChange={this.numCourseChange} />
              <Select options={typeOptions} simpleValue value={this.state.typeOption} placeholder='Job type' onChange={this.typeChange} />
            </div>
          </Collapse>
        </div>
        <br />
        <div className='Sorting'>
          <h1 onClick={() => this.setState({ sortOpen: !this.state.sortOpen})}>Sorting</h1>
          <br />
          <Collapse in={this.state.sortOpen}>
            <Select options={sortOptions} simpleValue value={this.state.sortOption} placeholder='Sort by' onChange={this.sortChange} />
          </Collapse>
        </div>
        <Row className='cards'>
        {jCards}
        </Row>
        <div className='pages' >
        <ReactPaginate
                    initialPage={this.state.page-1}
                    previousLabel={"previous"}
                    nextLabel={"next"}
                    breakLabel={<a>...</a>}
                    breakClassName={"break-me"}
                    pageCount={this.state.maxPage}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageChange}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"} />
         </div>
      </div>
    );
  }
}
export default Jobs;
