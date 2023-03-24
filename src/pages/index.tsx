import Head from 'next/head'
import Image from 'next/image'

import styles from '@/styles/Home.module.css'

import "primereact/resources/themes/viva-light/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"; 
import "primeflex/primeflex.css"

import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import React, { useEffect, useState } from 'react';
import { MenuItem, MenuItemCommandEvent } from 'primereact/menuitem';
import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { AutoComplete } from 'primereact/autocomplete';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Divider } from 'primereact/divider';
import { Chips } from 'primereact/chips';
import { Badge } from 'primereact/badge';
import { RadioButton } from 'primereact/radiobutton';
import { FileUpload } from 'primereact/fileupload';

import { InputNumber } from 'primereact/inputnumber';
        
import Typewriter from 'typewriter-effect';

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
    // const toast = useRef(null);
  const items: MenuItem[] = [
    {
        label: 'Portfolio',
        command: (event: MenuItemCommandEvent) => {
            // toast.current.show({ severity: 'info', summary: 'Third Step', detail: event.item.label });
        }
    },
    {
        label: 'Investor Info',
        command: (event: MenuItemCommandEvent) => {
            // toast.current.show({ severity: 'info', summary: 'First Step', detail: event.item.label });
        }
    },
    {
        label: 'AI Feedback',
        command: (event: MenuItemCommandEvent) => {
            // toast.current.show({ severity: 'info', summary: 'Last Step', detail: event.item.label });
        }
    }
  ]

  const [investorInfo, setInvestorInfo] = useState(null)
  const [chatGptFeedback, setChatGptFeedback] = useState({})

  const portfolioOptions = ['Manual', 'Import'];
  const [selectedPortfolioOption, setSelectedPortfolioOption] = useState(portfolioOptions[0]);

  const [selectedRiskTolerance, setSelectedRiskTolerance] = useState();
  const riskTolerances = [
      { name: 'Conservative', code: 'Conservative' },
      { name: 'Moderate', code: 'Moderate' },
      { name: 'Aggresive', code: 'Aggresive' },
  ];

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
      // setItems([...Array(10).keys()].map(item => event.query + '-' + item));
  }

  // const onSelectStock = (selectedStocks: any) => {
  //   console.log("SELECTED STOCKS: ", selectedStocks)
  //   const holdings = selectedStocks.map((selectedStock: any) => {
  //     return {
  //       ticker: selectedStock.ticker,
  //       companyName: selectedStock.securityName,
  //       allocation: 0,
  //     }
  //   })

  //   setPortfolioHoldings(holdings)
  // }
  useEffect(() => {
    console.log('SELECTED: ', stockSearchSelectedItems)
    if (stockSearchSelectedItems && stockSearchSelectedItems?.length > 0) {
      const holdings = stockSearchSelectedItems.map((selectedStock: any) => {
        return {
          ticker: selectedStock.symbol,
          companyName: selectedStock.securityName,
          allocation: 0,
        }
      })

      // TODO: Check for duplicates
  
      setPortfolioHoldings([...portfolioHoldings, ...holdings])
    }
  }, [stockSearchSelectedItems])

  const stockSearchTemplate = (stock: any) => {
    return (
      <div style={{display: "flex", alignItems: "center" }}>
        <Image
          className='stock-logo mr-2'
          alt='Image of company logo'
          src={`https://storage.googleapis.com/iex/api/logos/${stock.symbol}.png`}
          // onerror="this.onerror=null; this.src=''"
          // onError={() => setSrc('/assets/ima ge-error.png')}
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

  const stockColumnTemplate = (stock) => {
      return (
        <div style={{display: "flex", alignItems: "center" }}>
          <Image
            className='stock-logo mr-4'
            alt='Image of company logo'
            src={`https://storage.googleapis.com/iex/api/logos/${stock.ticker}.png`}
            // onerror="this.onerror=null; this.src=''"
            // onError={() => setSrc('/assets/ima ge-error.png')}
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

  const onClickNext = () => {
    setActiveIndex(activeIndex + 1)

    switch (activeIndex) {
      case 0:
        setInvestorInfo(null);
        break;
      case 1:
        break;
      case items.length - 1:
        // fetch('api/chatgpt/')
        // .then((response) => response.json())
        // .then((data) => {
        //    console.log(data);
        // })
        // .catch((err) => {
        //     console.log(err.message);
        // });
        break;
    }
  }

  const footer = (
    <span
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

  const removePortfolioHolding = (holding) => {
    const updatedHoldings = portfolioHoldings.filter((val) => val.ticker !== holding.ticker);
    setPortfolioHoldings(updatedHoldings);
  }

  const tableActionsCellTemplate = (rowData) => {
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

  const allocationEditor = (options) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} />;
  };

  // TODO: use useCallback
  const onPortfolioAllocationCellEditComplete = (e) => {
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
    <>
      <Head>
        <title>PortfolioBot - AI-Driven Feedback for your Investment Portfolio</title>
        {/* TODO: Add description */}
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.navbar}>
        <h1>PortfolioBot </h1>
        <Badge className='ml-2' value="BETA" severity="warning"></Badge>
      </div>

      <main className={styles.main}>

        <div className={styles.description}>

          {/* HEADER SECTION */}
          { activeIndex === 0 && (
            <div className='mb-5 text-center'>
              <h1>Are your investments
                <Typewriter
                  options={{
                    strings: [
                      ' diversified?',
                      ' cost-effective?',
                      ' too risky?'
                    ],
                    autoStart: true,
                    loop: true,
                    wrapperClassName: 'emphasized'
                  }}
                />
              </h1>
              <br></br>
              <p className='homepage-secondary-header'>
                Get <span className='emphasized'>AI-driven</span> feedback on your stock portfolio in minutes
              </p>
            </div>
          )}

          {/* STEPS */}
          <div className='mb-3'>
            <Steps
              model={items}
              activeIndex={activeIndex}
              onSelect={(e) => setActiveIndex(e.index)}
              readOnly={false}
            />
          </div>

          {/* FIRST STEP */}
          <div className={ activeIndex === 0 ? undefined : 'hidden'}>
            <Card>
              <SelectButton value={selectedPortfolioOption} onChange={(e) => setSelectedPortfolioOption(e.value)} options={portfolioOptions} />

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

                    <div style={{ fontSize: '0.7em'}} className='ml-2 mb-3'><a href="https://iexcloud.io">Data provided by IEX Cloud</a></div>

                    <DataTable
                      value={portfolioHoldings}
                      showGridlines
                      editMode="cell"
                      size='small'
                      footerColumnGroup={stockTableFooterGroup}
                      emptyMessage="Add assets to your portfolio using the search field above."
                    >
                      <Column header="Stock" body={stockColumnTemplate}/>
                      <Column
                        field="allocation"
                        header="Allocation %"
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
                    <div className="card flex mb-4">
                      <div className="flex flex-wrap gap-3">
                          <div className="flex align-items-center">
                              <RadioButton inputId="csv" name="csv" value="CSV" onChange={(e) => {}} checked={true} />
                              <label htmlFor="csv" className="ml-2">CSV/XLS</label>
                          </div>
                          <div className="flex align-items-center">
                              <RadioButton inputId="connect-account" name="account" value="Account" onChange={(e) => {}} checked={false} />
                              <label htmlFor="connect-account" className="ml-2">Connect Account</label>
                          </div>
                      </div>
                    </div>
                    <div>
                      {/* <p>Export your portfolio from your brokerage account and upload the file below.</p> */}
                      <div style={{ fontSize: '0.75em'}}>Export your portfolio from your brokerage account and upload the file below.</div>
                      <div style={{ fontSize: '0.75em'}} className='mb-3'>We currently only support the exports of <b>TDAmeritrade</b> & <b>Fidelity</b>, but aim to support more!</div>
                      {/* <Button label="Upload"></Button> */}
                      {/* <Toast ref={toast}></Toast> */}
                      <FileUpload mode="basic" chooseLabel='Upload' name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={() => {}} />
                    </div>
                    <div>
                      {/* <h2>Coming Soon!</h2> */}
                    </div>
                  </div>
                )
              }
            </Card>
          </div>

          {/* SECOND STEP */}
          <div className={ activeIndex === 1 ? 'step' : 'hidden'}>
            <Card>
              <div className="p-inputgroup">
                  <InputNumber placeholder="Your Age" />
              </div>
              <div className="p-inputgroup">
                  <InputNumber placeholder="Target Retirement Age" />
              </div>
              <div className="p-inputgroup">
                <Dropdown value={selectedRiskTolerance} onChange={(e) => setSelectedRiskTolerance(e.value)} options={riskTolerances} optionLabel="name" 
                  placeholder="Risk Tolerance" className="w-full md:w-14rem" />
              </div>
            </Card>
          </div>

          <br></br>

          {/* FINAL STEP */}
          <div className={ activeIndex === items.length - 1 ? undefined : 'hidden'}>
            <Accordion multiple activeIndex={[0,1]}>
                <AccordionTab header="Is my portfolio diversified enough?">
                    <small className="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </small>
                </AccordionTab>
                <AccordionTab header="What other stocks/ETFS should I invest in?">
                    <small className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa 
                        quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas 
                        sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
                        Consectetur, adipisci velit, sed quia non numquam eius modi.
                    </small>
                </AccordionTab>
            </Accordion>
          </div>

          <br></br>

          {/* BUTTONS */}
          <div className='button-panel'>
            {
              activeIndex > 0 && (
                <Button label="Back" onClick={() => setActiveIndex(activeIndex - 1)} />
              )
            }
            &nbsp;
            {
              activeIndex < items.length - 1 && (
                <Button
                  label={ activeIndex === 0 ? 'Get Started' : 'Next' }
                  disabled={
                    portfolioHoldings.length === 0 ||
                    portfolioHoldings.reduce((sum: number, stock: any) => (sum += Number(stock.allocation)), 0) !== 100
                  } 
                  onClick={onClickNext}
                />
              )
            }
          </div>

        </div>

        <Divider />
      </main>
    </>
  )
}
