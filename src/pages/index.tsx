import Head from 'next/head'
import Image from 'next/image'

import styles from '@/styles/Home.module.css'

import "primereact/resources/themes/viva-light/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"; 
import "primeflex/primeflex.css"

import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useState } from 'react';
import { MenuItem, MenuItemCommandEvent } from 'primereact/menuitem';
import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { AutoComplete } from 'primereact/autocomplete';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { RadioButton } from 'primereact/radiobutton';
import { FileUpload } from 'primereact/fileupload';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { Skeleton } from 'primereact/skeleton';
        
        
import Typewriter from 'typewriter-effect';
import ImageWithFallback from '@/components/ImageWithFallback';
import { InputText } from 'primereact/inputtext';
import { RiskTolerance } from '@/models/RiskTolerance.enum';

// TODO: Remove any types
// TODO: Refactor into smaller components

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

  const [investorInfo, setInvestorInfo] = useState<any>(null)

  const [investorAge, setInvestorAge] = useState<number | null>(null)
  const [investorRetirementAge, setInvestorRetirementAge] = useState<number | null>(null)
  const [investorRiskTolerance, setInvestorRiskTolerance] = useState<RiskTolerance | null>(null)
  const [investorGoals, setInvestorGoals] = useState<string | null>(null)
  const [chatGptFeedback, setChatGptFeedback] = useState<any>({})
  const [chatGptFeedbackLoading, setChatGptFeedbackLoading] = useState<boolean>(true)

  const portfolioOptions = ['Manual', 'Import'];
  const [selectedPortfolioOption, setSelectedPortfolioOption] = useState(portfolioOptions[0]);

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
  }

  useEffect(() => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockSearchSelectedItems])

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

  const onClickNext = () => {
    setActiveIndex(activeIndex + 1)
  }

  useEffect(() => {
    switch (activeIndex) {
      case 0:
        break;
      case 1:
        if (!investorAge || !investorRetirementAge) {

        }
        const investorInfo = {
          age: investorAge,
          retirementAge: investorRetirementAge,
          riskTolerance: investorRiskTolerance,
          investmentGoals: investorGoals,
        }

        setInvestorInfo(investorInfo);
        break;
      case items.length - 1:
        setChatGptFeedbackLoading(true)
        const chatGptFeedbackRequest = {
          investor: {
            age: investorAge,
            retirementAge: investorRetirementAge,
            riskTolerance: investorRiskTolerance,
            investmentGoals: investorGoals,
          },
          portfolioHoldings
        }
        fetch('api/chatgpt', {
          method: "POST",
          body: JSON.stringify(chatGptFeedbackRequest),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then((response) => response.json())
          .then((data) => {
            setChatGptFeedbackLoading(false)
            console.log(data);
            setChatGptFeedback(data)
          })
          .catch((err) => {
              console.log(err.message);
          });
        break;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

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
          { (activeIndex === 0 || activeIndex === 1) && (
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
                              <label htmlFor="csv" className="ml-2">File Upload</label>
                          </div>
                          <div className="flex align-items-center">
                              <RadioButton inputId="connect-account" name="account" value="Account" onChange={(e) => {}} checked={false} />
                              <label htmlFor="connect-account" className="ml-2">Connect Account</label>
                          </div>
                      </div>
                    </div>
                    <div>
                      {/* <p>Export your portfolio from your brokerage account and upload the file below.</p> */}
                      <div style={{ fontSize: '0.75em'}} className='mb-3'>
                        Export your portfolio from your brokerage account and upload the file below.
                        <br></br>
                        We currently only support the exports of <b>TDAmeritrade</b> & <b>Fidelity</b>, but aim to support more!
                      </div>
                      {/* <Button label="Upload"></Button> */}
                      {/* <Toast ref={toast}></Toast> */}
                      <FileUpload
                        mode="basic"
                        chooseLabel='Upload'
                        name="demo[]"
                        url="/api/upload"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        maxFileSize={1000000}
                        onUpload={() => {}}
                      />
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
              {/* <div className="p-inputgroup">
                  <InputNumber placeholder="Your Age" />
              </div>
              <div className="p-inputgroup">
                  <InputNumber placeholder="Target Retirement Age" />
              </div>
              <div className="p-inputgroup">
                <Dropdown value={selectedRiskTolerance} onChange={(e) => setSelectedRiskTolerance(e.value)} options={riskTolerances} optionLabel="name" 
                  placeholder="Risk Tolerance" className="w-full md:w-14rem" />
              </div> */}
              <div className="card flex flex-column md:flex-row gap-3 mb-3">
                <div className="p-inputgroup flex-1">
                    {/* <span className="p-inputgroup-addon">
                        <i className="pi pi-user"></i>
                    </span> */}
                    <InputNumber
                      placeholder="Age"
                      onChange={(e: InputNumberChangeEvent) => setInvestorAge(e.value)}
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    {/* <span className="p-inputgroup-addon">$</span>
                    <InputNumber placeholder="Price" />
                    <span className="p-inputgroup-addon">.00</span> */}
                    {/* <label htmlFor="target-retirement-age">Target Retirement Age</label> */}
                    <InputNumber
                      id="retirement-age"
                      placeholder="Retirement Age"
                      onChange={(e: InputNumberChangeEvent) => setInvestorRetirementAge(e.value)}
                    />
                </div>

                <div className="p-inputgroup flex-1">
                    {/* <span className="p-inputgroup-addon">www</span>
                    <InputText placeholder="Website" /> */}
                  <Dropdown
                    value={investorRiskTolerance}
                    onChange={(e) => setInvestorRiskTolerance(e.value)}
                    options={riskTolerances}
                    optionLabel="name" 
                    placeholder="Risk Tolerance"  />
                </div>
              </div>
              <div className="card flex flex-column md:flex-row gap-3">
                <div className="p-inputgroup flex-1">
                  <InputTextarea
                    placeholder="Investment Goal(s)"
                    maxLength={255}
                    rows={4}
                    cols={30}
                    onChange={(e) => setInvestorGoals(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </div>

          <br></br>

          {/* FINAL STEP */}
          <div className={ activeIndex === items.length - 1 ? undefined : 'hidden'}>
            {/* {
              chatGptFeedbackLoading && (
                <>
                  <ProgressSpinner style={{ color: '#6666ff'}} />
                  <p>Getting Feedback! This may take a few seconds.</p>
                </>
              )
            } */}

            <Accordion multiple activeIndex={[0,1,2]}>
              <AccordionTab header="Is my portfolio diversified enough?">
                {
                  !chatGptFeedback && <Skeleton height="2rem" className="mb-2" />
                }
                {
                  chatGptFeedback && (
                    <small className="m-0">
                        
                    </small>
                  )
                }
              </AccordionTab>
              <AccordionTab header="What other stocks/ETFS should I invest in?">  
                  {
                    !chatGptFeedback && <Skeleton height="2rem" className="mb-2" />
                  }
                  {
                    chatGptFeedback && (
                      <small className="m-0"  style={{whiteSpace: "pre-line"}}>
                      { chatGptFeedback.recommendedStocks?.content }
                      {/* { chatGptFeedback.recommendedStocks?.text } */}
                      </small>
                    )
                  }
              </AccordionTab>
              <AccordionTab header="Summary">
                {
                  !chatGptFeedback && <Skeleton height="2rem" className="mb-2" />
                }
                {
                  chatGptFeedback && (
                    <small className="m-0">
                        
                    </small>
                  )
                }
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

        {/* <Divider /> */}
      </main>

      {/* Banner Ad */}
      <div className='text-center'>
        {/* <Image
          src='/placeholder-large-leaderboard-banner-ad.jpeg'
          alt=''
          width={960}
          height={90}
        /> */}
      </div>

      {/* Footer   */}
    </>
  )
}
