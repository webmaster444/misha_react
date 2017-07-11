import React from 'react';
import ReactDOM from 'react-dom';

import {
  Row,
  Col,
  Grid,
  Panel,
  Table,
  PanelBody,
  PanelHeader,
  FormControl,
  PanelContainer,
  DropdownButton,
  MenuItem
} from '@sketchpixy/rubix';

import http from 'http';

class DatatableComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      pri_key:[],
      pri_active_key:'',
      sec_key:[],
      sec_active_key:'',
      third_key:[],
      third_active_key:'',
      meta_data:{},
      table_data:{},
      table_data_ready:false,
      table_data_header:[],
      table_data_content:[]
    };
  }
  componentDidMount() {
    console.log('didmount called');
    this.UserList();
  }

  UserList(){
    $.ajax({
      url: 'http://34.210.189.24/graphmeta',
      dataType: 'json',
      type: 'GET',
      success:function(data){
        this.setState({
          pri_key:Object.keys(data),
          meta_data:data
        })
      }.bind(this),
      error:function(error){
        console.log(error);
      }
    })
  }

  handleClick(element,nth){
    let meta_data = this.state.meta_data;
    if(nth=='primary'){
      this.setState({pri_active_key:element});
      this.setState({sec_key:meta_data[element]});
      var tmp_2nd = meta_data[element];
      this.setState({sec_key:Object.keys(tmp_2nd)});
      $.ajax({
        url: 'http://34.210.189.24/update_pk/'+element,
        dataType: 'json',
        type: 'GET',
        success:function(data){
          console.log('pk set succeed');
        },
        error:function(error){
          console.log(error);
        }
      })
    }else if(nth=='second'){
      this.setState({sec_active_key:element});
      let ts = this.state.pri_active_key;
      let third_array = meta_data[ts][element];
      this.setState({third_key:third_array});
      $.ajax({
        url: 'http://34.210.189.24/update_sk/'+element,
        dataType: 'json',
        type: 'GET',
        success:function(data){
          console.log('sk set succeed');
        },
        error:function(error){
          console.log(error);
        }
      })
    }else if(nth=='third'){
      this.setState({third_active_key:element});
      $.ajax({
        url: 'http://34.210.189.24/update_ck/'+element,
        dataType: 'json',
        type: 'GET',
        success:function(data){
          $.ajax({
            url: 'http://34.210.189.24/graphview',
            dataType: 'json',
            type: 'GET',
            success:function(data){
              var products_cnt = data[Object.keys(data)[0]].length;
              var products_data = [];
              for(var i=0;i<products_cnt;i++){
                var tmp_array = [];
                for(let element in data){
                    tmp_array.push(data[element][i]);
                  } 
                  products_data.push(tmp_array);
              }
              this.setState({table_data:data,table_data_ready:true, table_data_header:Object.keys(data),table_data_content:products_data});
                $(ReactDOM.findDOMNode(this.example))
                  .addClass('nowrap')
                  .dataTable({
                    responsive: true,
                    columnDefs: [
                      { targets: [-1, -3], className: 'dt-body-right' }
                    ]
                });
            }.bind(this),
            error:function(error){
              console.log(error);
            }
          })
        }.bind(this),
        error:function(error){
          console.log(error);
        }
      })
    }
  }

  render() {
    let _this = this;
    let pri_title = '', sec_title='',third_title='';
    if(this.state.pri_active_key ==''){
      pri_title = 'Primary Key';
    }else{
      pri_title = this.state.pri_active_key;
    }

    if(this.state.sec_active_key ==''){
      sec_title = 'Secondary Key';
    }else{
      sec_title = this.state.sec_active_key;
    }

    if(this.state.third_active_key ==''){
      third_title = 'Tertiary Key';
    }else{
      third_title = this.state.third_active_key;
    }

    const table_data_ready = this.state.table_data_ready; 

    console.log(this.state.table_data_content);
    return (
      <PanelContainer noOverflow className='table_panel_wrapper'>
        <Panel>
            <Grid>
              <Row>
              <Col xs={12}>
              <Row>
              <Col sm={3} xs={12}>
              <DropdownButton bsStyle='darkgreen45' title={pri_title} id='primary_dropdown'>
                {this.state.pri_key.map(function(element,i){
                  return (<MenuItem key={i} eventKey={i} onSelect={()=>_this.handleClick(element,'primary')}>{element}</MenuItem>);
                })}
              </DropdownButton>
              </Col>
              
              <Col sm={3} xs={12}>
              <DropdownButton bsStyle='darkgreen45' title={sec_title} id='secondary_dropdown'>
                {this.state.sec_key.map(function(element,i){
                  return (<MenuItem key={i} eventKey={i} onSelect={()=>_this.handleClick(element,'second')}>{element}</MenuItem>);
                })}
              </DropdownButton>
              </Col>

              <Col sm={3} xs={12}>
              <DropdownButton bsStyle='darkgreen45' title={third_title} id='teritary_dropdown'>
                {this.state.third_key.map(function(element,i){
                  return (<MenuItem key={i} eventKey={i} onSelect={()=>_this.handleClick(element,'third')}>{element}</MenuItem>);
                })}
              </DropdownButton>
              </Col>
              </Row>
              </Col>
              </Row>
              <hr/>

              <Row>
              <Col xs={12}>
                {!table_data_ready?(
                  <p> Please Select Keys </p>
                  ):(
                    <Table ref={(c) => this.example = c} className='display' cellSpacing='0' width='100%'>
                          <thead>
                          <tr>
                          
                          {this.state.table_data_header.map(function(element,i){
                            return <th> {element} </th>;
                          })}
                          </tr>
                          </thead>
                          <tbody>
                             {this.state.table_data_content.map((row, i) =>
                              <tr key={i}>
                                {row.map((col, j) =>
                                  <td key={j}>{col}</td>
                                )}
                              </tr>
                            )}
                          </tbody>
                    </Table>
                  )
                }
              </Col>
              </Row>
            </Grid>
        </Panel>
      </PanelContainer>
    );
  }
}

export default class DataBrowser extends React.Component {
  render() {
    return (
      <Row>
        <Col xs={12}>
          <PanelContainer>
            <Panel>
              <PanelBody>
                <Grid>
                  <Row>
                    <Col xs={12}>
                      <DatatableComponent />
                      <br/>
                    </Col>
                  </Row>
                </Grid>
              </PanelBody>
            </Panel>
          </PanelContainer>
        </Col>
      </Row>
    );
  }
}
