import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card'
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { DataTable } from 'primereact/datatable';
import { InputNumber } from 'primereact/inputnumber';
import { Row } from 'primereact/row';
import { SelectButton } from 'primereact/selectbutton';
import React, { useState } from 'react'
import ImageWithFallback from '../generic/ImageWithFallback';

const PortfolioSection = ({}) => {
  const portfolioOptions = ['Manual', 'Import'];
  const [selectedPortfolioOption, setSelectedPortfolioOption] = useState(portfolioOptions[0]);

  const [stockSearchSelectedItems, setStockSearchSelectedItems] = useState([]);
  const [stockSearchSuggestions, setStockSearchSuggestions] = useState([]);

  const [portfolioHoldings, setPortfolioHoldings] = useState<any[]>([]);

  const searchStocks = (event: any) => {
    fetch(`/api/iexcloud/search/${event.query}`)
      .then((response) => response.json())
      .then((data) => {
        setStockSearchSuggestions(data)
      })
      .catch((err) => {
          console.log(err.message);
      });
  }

  const footer = (
    <span
      // TODO: show gray text if 0, and red if over 100 or negative
      style={{
        color: portfolioHoldings.reduce((sum: number, stock: any) => (sum += Number(stock.allocation)), 0) === 100 ?
          '#32a852' :
          '#ff1717'
      }}
    >
      Total: {portfolioHoldings.reduce((sum: number, stock: any) => (sum += Number(stock.allocation)), 0)}%
    </span>
  )

  const stockTableFooterGroup = (
    <ColumnGroup>
      <Row>
        <Column footer={footer} colSpan={3} footerStyle={{ textAlign: 'center' }} />
        {/* <Column footer={"Test"} />
        <Column footer={"test"} /> */}
      </Row>
    </ColumnGroup>
  );

  const removePortfolioHolding = (holding: any) => {
    const updatedHoldings = portfolioHoldings.filter((val) => val.ticker !== holding.ticker);
    setPortfolioHoldings(updatedHoldings);
  }

  const tableActionsCellTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <div className='text-center'>
          <Button
            size="small"
            icon="pi pi-trash"
            rounded
            outlined
            severity="danger"
            onClick={() => removePortfolioHolding(rowData)}
          />
        </div>
      </React.Fragment>
    );
  };

  const allocationEditor = (options: any) => {
    return (
      <div className='p-inputgroup'>
        <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />
        <span className="p-inputgroup-addon">%</span>
      </div>
    );
  };

  const stockSearchTemplate = (stock: any) => {
    return (
      <div style={{display: "flex", alignItems: "center" }}>
        <ImageWithFallback
          alt='Image of company logo'
          src={`https://storage.googleapis.com/iex/api/logos/${stock.symbol}.png`}
          fallbackSrc='/missing-image.png'
          className='stock-logo mr-2'
          width={24}
          height={24}
        />
        <small>
          <b>{stock.symbol}</b>
        </small>
        <span className='m-2'>|</span>
        <small>
          { stock.securityName }
        </small>
      </div>
    )
  }

  const stockColumnTemplate = (stock: any) => {
    return (
      <div style={{display: "flex", alignItems: "center" }}>
        <ImageWithFallback
          className='stock-logo mr-4'
          alt='Image of company logo'
          src={`https://storage.googleapis.com/iex/api/logos/${stock.ticker}.png`}
          fallbackSrc='/missing-image.png'
          width={36}
          height={36}
        />
        <div>
          <p><b>{stock.ticker}</b></p>
          <small>{stock.companyName}</small>
        </div>
      </div>
    )
  };

  // TODO: use useCallback
  const onPortfolioAllocationCellEditComplete = (e: any) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    // console.log("FIELD: ", field)
    const updatedHoldings = portfolioHoldings.map(holding => {
      if (holding.ticker === rowData.ticker) {
        let updatedHolding = {...holding}
        updatedHolding.allocation = newValue
        return updatedHolding
      }
      return holding
    });

    setPortfolioHoldings(updatedHoldings)

    rowData[field] = newValue; //+ "%"
  };
  
  return (
    <Card>
      <div className='text-center'>
        <SelectButton
          value={selectedPortfolioOption}
          onChange={(e) => setSelectedPortfolioOption(e.value)}
          options={portfolioOptions}
        />
        </div>

        <br></br>

        {
          selectedPortfolioOption === "Manual" && (
            <div>
              <div className='mb-1 p-inputgroup'>
                <AutoComplete
                  inputId="stockSearch"
                  field="symbol"
                  value={stockSearchSelectedItems}
                  suggestions={stockSearchSuggestions} 
                  completeMethod={searchStocks}
                  // TODO: Remove multiple attribute and make setStockSearchSelectedItems an object not an array
                  multiple={true}
                  onChange={(e) => setStockSearchSelectedItems(e.value)}
                  itemTemplate={stockSearchTemplate}
                  placeholder="Search for stocks or ETFs e.g. AAPL or Apple"
                  forceSelection
                  />
              </div>

              <div style={{ fontSize: '0.7em'}} className='ml-2 mb-3'>
                  <a href="https://iexcloud.io">Data provided by IEX Cloud</a>
              </div>

              <DataTable
                  value={portfolioHoldings}
                  editMode="cell"
                  size='small'
                  footerColumnGroup={stockTableFooterGroup}
                  emptyMessage="Add assets to your portfolio using the search field above."
              >
                <Column header="Stock" body={stockColumnTemplate}/>
                <Column
                  field="allocation"
                  header="Allocation"
                  editor={(options) => allocationEditor(options)}
                  onCellEditComplete={onPortfolioAllocationCellEditComplete}
                />
                <Column body={tableActionsCellTemplate} exportable={false}/>
              </DataTable>
            </div>
          )
        }
        {
        selectedPortfolioOption === "Import" && (
            <div>
            {/* <div className="card flex mb-4">
                <div className="flex flex-wrap gap-3">
                    <div className="flex align-items-center">
                        <RadioButton inputId="csv" name="csv" value="CSV" onChange={(e) => {}} checked={true} />
                        <label htmlFor="csv" className="ml-2">File Upload</label>
                    </div>
                    <div className="flex align-items-center">
                        <RadioButton inputId="connect-account" name="account" value="Account" onChange={(e) => {}} checked={false} />
                        <label htmlFor="connect-account" className="ml-2">Connect Account</label>
                    </div>
                </div>
            </div> */}
            {/* <div>
                <div style={{ fontSize: '0.75em'}} className='mb-3'>
                Export your portfolio from your brokerage account and upload the file below.
                <br></br>
                We currently only support the exports of the following brokerages: <b>TDAmeritrade</b>, <b>Fidelity</b> & <b>Vanguard</b>.
                </div>
                <FileUpload
                mode="basic"
                chooseLabel='Upload'
                name="demo[]"
                url="/api/upload"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                maxFileSize={1000000}
                onUpload={() => {}}
                />
            </div> */}
            <div className='text-center'>
                <h1>Coming Soon!</h1>
                {/* <small>We are working hard so you import .csv and .xls files exported brokeage account, as well as </small> */}
            </div>
            </div>
        )
      }
    </Card>
  )
}

export default PortfolioSection