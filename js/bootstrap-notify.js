// read WebURL from current browser
var WebURL         = "https://getablocks.com/";  // Website URL is:  https://domain.com/
// WebURL correction if not ends with /
if (WebURL.substring(WebURL.length-1) != "/")
{
	WebURL = WebURL + "/";
	console.log('Corrected WebURL, does not end with / -> New WebURL : ', WebURL);
}
var API            = "https://getablocks.com/api/";   						// API addess is:  https://domain.com/api/
// API correction if not ends with /
if (API.substring(API.length-1) != "/")
{
	API = API + "/";
	console.log('Corrected API, does not end with / -> New API : ', API);
} 
var stratumAddress = "eu.getablocks.com";          				// Stratum address is:  domain.com
             
var stratumAddressUS = "us.getablocks.com";



  

 var stratumAddressJP = "jp.getablocks.com";



// --------------------------------------------------------------------------------------------
// no need to change anything below here
// --------------------------------------------------------------------------------------------
console.log('MiningCore.WebUI : ', WebURL);		                      // Returns website URL
console.log('API address used : ', API);                                      // Returns API URL
console.log('Stratum address  : ', "stratum+tcp://" + stratumAddress + ":");  // Returns Stratum URL
console.log('Page Load        : ', window.location.href);                     // Returns full URL

currentPage = "index"

// check browser compatibility
var nua = navigator.userAgent;
//var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));
var is_IE = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Trident') > -1) && !(nua.indexOf('Chrome') > -1));
if(is_IE) {
	console.log('Running in IE browser is not supported - ', nua);
}

// Load INDEX Page content
function loadIndex() {
  $("div[class^='page-").hide();
  
  $(".page").hide();
  //$(".page-header").show();
  $(".page-wrapper").show();
  $(".page-footer").show();
  
  var hashList = window.location.hash.split(/[#/?=]/);
  //var fullHash = document.URL.substr(document.URL.indexOf('#')+1);   //IE
  // example: #vtc/dashboard?address=VttsC2.....LXk9NJU
  currentPool    = hashList[1];
  currentPage    = hashList[2];
  currentAddress = hashList[3];
  
  if (currentPool && !currentPage)
  {
    currentPage ="stats"
  }
  else if(!currentPool && !currentPage)
  {
    currentPage ="index";
  }
  if (currentPool && currentPage) {
    loadNavigation();
    $(".main-index").hide();
	$(".main-pool").show();
	$(".page-" + currentPage).show();
	$(".main-sidebar").show();
  } else {
    $(".main-index").show();
	$(".main-pool").hide();
	$(".page-index").show();
    $(".main-sidebar").hide();
  }
  
  if (currentPool) {
	$("li[class^='nav-']").removeClass("active");
    
	switch (currentPage) {
      case "stats":
	    console.log('Loading stats page content');
	    $(".nav-stats").addClass("active");
        loadStatsPage();
        break;
      case "dashboard":
	    console.log('Loading dashboard page content');
        $(".nav-dashboard").addClass("active");
		loadDashboardPage();
        break;
	  case "miners":
	    console.log('Loading miners page content');
        $(".nav-miners").addClass("active");
		loadMinersPage();
        break;
      case "blocks":
	    console.log('Loading blocks page content');
	    $(".nav-blocks").addClass("active");
        loadBlocksEffortTable();
        loadBlocksPage();
        break;
      case "payments":
	    console.log('Loading payments page content');
	    $(".nav-payments").addClass("active");
        loadPaymentsPage();
        break;
      case "connect":
	    console.log('Loading connect page content');
        $(".nav-connect").addClass("active");
		loadConnectPage();
        break;
	  case "faq":
	    console.log('Loading faq page content');
        $(".nav-faq").addClass("active");
        break;
      case "support":
	    console.log('Loading support page content');
        $(".nav-support").addClass("active");
		break;
		// case "markets":
		//   console.log('Loading exchanges page content');
		//   $(".nav-markets").addClass("active");
		//   break;
		// case "calculators":
		//   console.log('Loading calculators page content');
		//   $(".nav-calculators").addClass("active");
		//   break;
		default:
		// default if nothing above fits
	  }
	} else {
	  // Load the default page on page load
	  loadHomePage();
  
	  // Add click handlers to the SOLO and PPLNS buttons
	  $("#solo-btn").on("click", function () {
		loadHomePage(payoutScheme = "SOLO");
	  });
  
	  $("#pplns-btn").on("click", function () {
		loadHomePage(payoutScheme = "PPLNS");
	  });
	  // loadCoinPrice();
	  // loadAllCoins();
  }
  scrollPageTop();
}

// Load HOME page content
function loadHomePage(payoutScheme = "PPLNS") {
  //console.log('Loading home page content');
	return $.ajax(API + "pools")
    .done(function(data) {
		const poolCoinCardTemplate = $(".index-coin-card-template").html();
		//const poolCoinTableTemplate = "";  //$(".index-coin-table-template").html();
		var poolCoinTableTemplate = "";
		$.each(data.pools, function(index, value) 
		{
			if (value.paymentProcessing.payoutScheme === payoutScheme) 
			{
				var algo_ids = value.id;
				var getcoin_price = 0;
		
				if(value.coin.type == "SKYDOGE")
				{
					$.ajax("https://api.xeggex.com/api/v2/market/getbysymbol/SKY%2FUSDT").done(function(data){
						//console.log("https://api.xeggex.com/api/v2/market/getbysymbol/"+ value.coin.type +"%2FUSDT");
						getcoin_price = data['lastPrice'];
						$("."+algo_ids).html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' , maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price));
				}).fail(function() {
					getcoin_price = "NaN";
				});
				}
				if(value.coin.type == "XPB")
				{
					$.ajax("https://financex.trade/api/v2/trade/public/markets/xpbusdt/tickers").done(function(data){
						getcoin_price = data['ticker']['last'];
						$("."+algo_ids).html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' , maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price));
					}).fail(function() {
						getcoin_price = "NaN";
					});
				}
				else if(value.coin.type == "LOG")
				{
					$.ajax("https://api.coingecko.com/api/v3/simple/price?ids=woodcoin&vs_currencies=usd").done(function(data){
						getcoin_price = data['woodcoin']['usd'];
						$("."+algo_ids).html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' , maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price));
					}).fail(function() {
						getcoin_price = "NaN";
					});
				}
				else if(value.coin.type == "ISO")
				{
					$.ajax("https://www.bitxonex.com/api/v2/trade/public/markets/isousdt/tickers").done(function(data){
						getcoin_price = data['ticker']['last'];
						$("."+algo_ids).html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' , maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price));
					}).fail(function() {
						getcoin_price = "NaN";
					});
				}
				else if(value.coin.type == "ETX")
				{
					$.ajax("https://www.bitxonex.com/api/v2/trade/public/markets/etxusdt/tickers").done(function(data){
						getcoin_price = data['ticker']['last'];
						$("."+algo_ids).html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' , maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price));
					}).fail(function() {
						getcoin_price = "NaN";
					});
				}
				else if(value.coin.type == "MBC")
				{
					$.ajax("https://www.bitxonex.com/api/v2/trade/public/markets/mbcusdt/tickers").done(function(data){
						getcoin_price = data['ticker']['last'];
						$("."+algo_ids).html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' , maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price));
					}).fail(function() {
						getcoin_price = "NaN";
					});
				}
				else if(value.coin.type == "GEC")
				{
					$.ajax("https://www.bitxonex.com/api/v2/trade/public/markets/gecusdt/tickers").done(function(data){
						getcoin_price = data['ticker']['last'];
						$("."+algo_ids).html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' , maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price));
					}).fail(function() {
						getcoin_price = "NaN";
					});
				}
				else if(value.coin.type == "dint")
				{
					$.ajax("https://financex.trade/api/v2/trade/public/markets/dintusdt/trades?limit=100&order_by=desc").done(function(data){
						getcoin_price = data['lastPrice'];
						$("."+algo_ids).html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' , maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price));
					}).fail(function() {
						getcoin_price = "NaN";
					});
				}
				else
				{
					$.ajax("https://api.xeggex.com/api/v2/market/getbysymbol/"+ value.coin.type +"%2FUSDT").done(function(data){
						//console.log("https://api.xeggex.com/api/v2/market/getbysymbol/"+ value.coin.type +"%2FUSDT");
						getcoin_price = data['lastPrice'];
						$("."+algo_ids).html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' , maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price));
					}).fail(function() {
						getcoin_price = "NaN";
					});
				}
				var coinLogo = "<img class='coinimg' src='img/coin/icon/" + value.coin.type.toLowerCase() + ".png'  style='width:32px;'/>";
				var coinName = value.coin.name;
				if (typeof coinName === "undefined" || coinName === null) {coinName = value.coin.type;} 

				var lastPoolBlockTime = convertUTCDateToLocalDate(new Date(value.lastPoolBlockTime), false);
				var lastPoolBlockTimeAgo = getTimeAgo(lastPoolBlockTime); // Calculate the time difference

				var pool_mined = true;
				var pool_networkstat_hash = "<div class='progress-bar progress-bar-striped progress-bar-animated bg-warning wp-100'>&nbsp;processing...&nbsp;</div>";
				var pool_networkstat_diff = "<div class='progress-bar progress-bar-striped progress-bar-animated bg-warning wp-100'>&nbsp;processing...&nbsp;</div>";
				if(value.hasOwnProperty('networkStats'))
				{
					pool_networkstat_hash = _formatter(value.networkStats.networkHashrate, 3, "H/s");
					pool_networkstat_diff = _formatter(value.networkStats.networkDifficulty, 6, "");
					pool_mined = false;
				}
		
				var pool_stat_miner = "<div class='progress-bar progress-bar-striped progress-bar-animated bg-warning wp-100'>&nbsp;processing...&nbsp;</div>";
				var pool_stat_hash = "<div class='progress-bar progress-bar-striped progress-bar-animated bg-warning wp-100'>&nbsp;processing...&nbsp;</div>";
				if(value.hasOwnProperty('networkStats'))
				{
					pool_stat_miner = value.poolStats.connectedMiners;
					pool_stat_hash = _formatter(value.poolStats.poolHashrate, 3, "H/s");
					pool_mined = false;
				}
		
				var pool_connected = "<button type='button' class='btn btn-warning btn-loading'>Loading...</button>";
				var pool_stat = "❌ Offline";
				if(!pool_mined)
				{
					pool_stat = "✅ Online";
					pool_connected = "<a href='#" + value.id + "' class='btn btn-primary'>Connect</a>";
				}
				poolCoinTableTemplate += "<div class='col-lg-6 col-sm-12 col-md-6 col-xl-3'><div class='card card-shadow'>";
				poolCoinTableTemplate += "<div class='card-header'><h4 class='text-center'>"+ coinLogo + " " + coinName + " ("+ value.paymentProcessing.payoutScheme + ") </h></div>";
				poolCoinTableTemplate += "<div class='card-body'>";
				poolCoinTableTemplate += "<div class='row'><div class='col'><div class='card-title'>Algorithm</div></div><div class='col'><div class='card-title'>" + value.coin.algorithm + "</div></div></div>";
				poolCoinTableTemplate += "<div class='row'><div class='col'><div class='card-title'>Pool Miners</div></div><div class='col'><div class='card-title'>" + pool_stat_miner + "</div></div></div>";
				poolCoinTableTemplate += "<div class='row'><div class='col'><div class='card-title'>Pool Hashrate</div></div><div class='col'><div class='card-title'>" + pool_stat_hash + "</div></div></div>";
				poolCoinTableTemplate += "<div class='row'><div class='col'><div class='card-title'>Network Hashrate</div></div><div class='col'><div class='card-title'>" + pool_networkstat_hash + "</div></div></div>";
				poolCoinTableTemplate += "<div class='row'><div class='col'><div class='card-title'>Network Difficulty</div></div><div class='col'><div class='card-title'>" + pool_networkstat_diff + "</div></div></div>";
				poolCoinTableTemplate += "<div class='row'><div class='col'><div class='card-title'>Pool Effort</div></div><div class='col'><div class='card-title'>" + (value.poolEffort*100).toFixed(2) + " % </div></div></div>";
				poolCoinTableTemplate += "<div class='row'><div class='col'><div class='card-title'>Pool Fee</div></div><div class='col'><div class='card-title'>" + value.poolFeePercent + " % </div></div></div>";
				poolCoinTableTemplate += "<div class='row'><div class='col'><div class='card-title'>Price</div></div><div class='col'><div class='card-title "+algo_ids+"'>$" + Intl.NumberFormat().format(getcoin_price) + "</div></div></div>";
				poolCoinTableTemplate += "<div class='row'><div class='col'><div class='card-title'>Last Pool Block</div></div><div class='col'><div class='card-title'>" + lastPoolBlockTimeAgo + "</div></div></div>";
				poolCoinTableTemplate += "<div class='row'><div class='col'><div class='card-title'>Pool Stats</div></div><div class='col'><div class='card-title'>"+ pool_stat +"</div></div></div>";
				poolCoinTableTemplate += "</div";
				poolCoinTableTemplate += "<div class='card-footer'><div class='card-title text-center'>"+pool_connected+"</div></div>";
				poolCoinTableTemplate += "</div></div>";
			}
		});

       	$(".pool-coin-table").html(poolCoinTableTemplate);
	  	  
		$(document).ready(function() 
		{
			$('#pool-coins tr').click(function() 
			{
				var href = $(this).find("a").attr("href");
				if(href) 
				{
					window.location = href;
				}
			});
		});
	  
    })
    .fail(function() 
	{
		var poolCoinTableTemplate = "";
	  
		poolCoinTableTemplate += "<tr><td colspan='8'> ";
		poolCoinTableTemplate += "<div class='alert alert-warning'>"
		poolCoinTableTemplate += "	<h4><i class='fas fa-exclamation-triangle'></i> Warning!</h4>";
		poolCoinTableTemplate += "	<hr>";
		poolCoinTableTemplate += "	<p>The pool is currently down for maintenance.</p>";
		poolCoinTableTemplate += "	<p>Please try again later.</p>";
		poolCoinTableTemplate += "</div>"
		poolCoinTableTemplate += "</td></tr>";
	  
		$(".pool-coin-table").html(poolCoinTableTemplate);
	  
    });
}

// Load STATS page content
function loadStatsPage() {
  //clearInterval();
  setInterval(
    (function load() {
      loadStatsData();
      return load;
    })(),
    60000 // Changed to 1 minute (60000 milliseconds)
  );
  setInterval(
    (function load() {
      loadStatsChart();
      return load;
    })(),
    60000 // Changed to 1 minute (60000 milliseconds)
  );
  setInterval(
    (function load() {
      loadWorkerTTFBlocks();
      return load;
    })(),
    60000 // Changed to 1 minute (60000 milliseconds)
  );
}

// Load DASHBOARD page content
function loadDashboardPage() {
  function render() {
    //clearInterval();
    setInterval(
      (function load() {
		loadDashboardData($("#walletAddress").val());
		loadDashboardWorkerList($("#walletAddress").val());
		loadDashboardChart($("#walletAddress").val());
        loadUserBalanceData($("#walletAddress").val());
		loadWorkerTTFBlocks($("#walletAddress").val());
		loadBlocksMinerPage($("#walletAddress").val());
		loadPaymentsMinerPage($("#walletAddress").val());
		loadEarningsMinerPage($("#walletAddress").val());
		return load;
      })(),
      60000
    );
  }
  var walletQueryString = window.location.hash.split(/[#/?]/)[3];
  if (walletQueryString) {
    var wallet = window.location.hash.split(/[#/?]/)[3].replace("address=", "");
    if (wallet) {
      $(walletAddress).val(wallet);
      localStorage.setItem(currentPool + "-walletAddress", wallet);
      render();
    }
  }
  if (localStorage[currentPool + "-walletAddress"]) {
    $("#walletAddress").val(localStorage[currentPool + "-walletAddress"]);
  }
}


// Load MINERS page content
function loadMinersPage() {
  return $.ajax(API + "pools/" + currentPool + "/miners?page=0&pagesize=20")
    .done(function(data) {
      var minerList = "";
      if (data.length > 0) {
        $.each(data, function(index, value) {
        minerList += "<tr>";
        minerList += '<td><a onClick="window.location=\'' + WebURL + '#' + currentPool + '/dashboard?address=' + value.miner + '\'">' + value.miner + '</a></td>';
        minerList += "<td>" + _formatter(value.hashrate, 2, "H/s") + "</td>";
        minerList += "<td>" + _formatter(value.sharesPerSecond, 2, "S/s") + "</td>";
        minerList += "</tr>";
        });
      } else {
        minerList += '<tr><td colspan="4">No miner connected</td></tr>';
      }
      $("#minerList").html(minerList);
    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadMinersList)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}

// Load BlocksEffort
function loadBlocksEffortTable() {
	return $.ajax(API + "pools/" + currentPool + "/blocks?page=0&pageSize=10000")
    .done(function(data) {	
		var BlocksEffortList = "";
		var effortsum = 0;
		var allblocks = 0;
		var uncleblocks = 0;
		var orphanedblocks = 0;
		
		if (data.length > 0) {
			$.each(data, function(index, value) {
				if (typeof value.effort !== "undefined") {
					allblocks = allblocks + 1;
					effortsum = effortsum + Math.round(value.effort * 100);
				}
		
				if (value.status == "orphaned") {
					orphanedblocks = orphanedblocks + 1;
				}
		
				if (value.type == "uncle") {
					uncleblocks = uncleblocks + 1;
				}
				
				var AverageLuck = Math.round(effortsum/allblocks);
				var UncleRate = (uncleblocks/allblocks * 100).toFixed(2);
				var OrphanRate = (orphanedblocks/allblocks * 100).toFixed(2);

				if ((allblocks == 16)||(allblocks == 32)||(allblocks == 64) ||(allblocks == 128) ||(allblocks == 256) ||(allblocks == 512) || (allblocks == 1024)) {
					BlocksEffortList += "<tr>";
					BlocksEffortList += "<td>" + allblocks + "</td>";	
					BlocksEffortList += "<td>" + AverageLuck + " %</td>";
					BlocksEffortList += "<td>" + UncleRate + " %</td>";
					BlocksEffortList += "<td>" + OrphanRate + " %</td>";
					BlocksEffortList += "</tr>";					
				} 
			});
		} else {
			BlocksEffortList += '<tr><td colspan="4">No blocks found yet</td></tr>';
		}

		$("#BlocksEffortList").html(BlocksEffortList);		
	})
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadBlocksList)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}	

// Load BLOCKS page content
function loadBlocksPage() 
{
	//console.log("loadBlocksPage");
	return $.ajax(API + "pools/" + currentPool + "/blocks?page=0&pageSize=100")
    .done(function (data) {
		var blockList = "";
		var newBlockList = "";
		var newBlockCount = 0;
		var pendingBlockList = "";
		var pendingBlockCount = 0;
		var confirmedBlockCount = 0;
		// Reset minerBlocks before populating again
		minerBlocks = {};
		if (data.length > 0) 
		{
			$.each(data, function (index, value) 
			{
				var createDate = convertUTCDateToLocalDate(new Date(value.created), false);
				var effort = Math.round(value.effort * 100);
				var effortClass = "";
				var ServerFlag = "<img class='serverimg small-server-image' src='img/coin/" + value.source + ".png' />";

				if (effort < 100) 
				{
					effortClass = "effort1";
				} 
				else if (effort < 200) 
				{
					effortClass = "effort2";
				} 
				else  
				{
					effortClass = "effort3";
				} 

				var status = value.status;
				var blockTable = (status === "pending" && value.confirmationProgress === 0) ? newBlockList : pendingBlockList && (status === "pending") ? pendingBlockList : blockList;
				var timeAgo = getTimeAgo(createDate); // Calculate the time difference

				blockTable += "<tr>";
				blockTable += "<td>" + timeAgo + "</td>";
				blockTable += "<td>" + value.miner.substring(0, 8) + " &hellip; " + value.miner.substring(value.miner.length - 8) + "</td>";
				blockTable += "<td><a href='" + value.infoLink + "' target='_blank'>" + Intl.NumberFormat().format(value.blockHeight) + "</a></td>";
	
				blockTable += "<td>" + _formatter(value.networkDifficulty, 5, "") + "</td>";
				if (typeof value.effort !== "undefined") 
				{
					blockTable += "<td class='" + effortClass + "'>" + effort + "%</td>";
				} 
				else 
				{
					blockTable += "<td>Calculating...</td>";
				}
				blockTable += "<td>";
				// Block object for each block
				var block = {
					timeAgo: timeAgo,
					blockHeight: value.blockHeight,
					miner: value.miner,
					networkDifficulty: value.networkDifficulty.toFixed(8),
					effortClass: effortClass,
					status: value.status,
					progressValue: progressValue,
				};
				if (status === "pending") 
				{
					if (value.confirmationProgress === 0) 
					{
						blockTable += "New Block";
						block.reward = "Waiting...";
						blockTable += "<td>Waiting...</td>";
						blockTable += "<td>Waiting...</td>";
						newBlockCount++;
					} 
					else 
					{
						blockTable += "Pending";
						block.reward = "Waiting...";
						blockTable += "<td>Waiting...</td>";
						if (value.type =="uncle") blockTable += "<td>" + "Uncle" + "</td>";
						else if (status === "orphaned") blockTable += "<td>" + "Orphaned" + "</td>";
						else blockTable += "<td>" + "Block" + "</td>";
						pendingBlockCount++;
					}
				} 
				else if (status === "confirmed") 
				{
					blockTable += "Confirmed";
					block.reward = Intl.NumberFormat().format(value.reward);
					blockTable += "<td>" + Intl.NumberFormat().format(value.reward) + "</td>";
					if (value.type =="uncle") blockTable += "<td>" + "Uncle" + "</td>";
					else blockTable += "<td>" + "Block" + "</td>";
					confirmedBlockCount++;
				} 
				else if (status === "orphaned") 
				{
					blockTable += "Orphaned";
					block.reward = Intl.NumberFormat().format(value.reward);
					blockTable += "<td>" + Intl.NumberFormat().format(value.reward) + "</td>";
					blockTable += "<td>" + "Orphaned" + "</td>";
				} 
				else 
				{
					blockTable += status;
				}
				// Populate minerBlocks based on the miner value
				if (!minerBlocks[value.miner]) 
				{
					minerBlocks[value.miner] = [];
				}
				minerBlocks[value.miner].push(block);
				blockTable += "</td>";
				var progressValue = (currentPool.includes("woodcoin")) ? Math.min(Math.round(value.confirmationProgress * 6 * 100), 100) : Math.round(value.confirmationProgress * 100);
				blockTable += "<td><div class='progress-bar bg-green progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='" + progressValue + "' aria-valuemin='0' aria-valuemax='100' style='width: " + progressValue + "%'><span>" + progressValue + "% Completed</span></div></td>";
				blockTable += "</tr>";

				if (status === "pending") 
				{
					if (value.confirmationProgress === 0) 
					{
						newBlockList = blockTable;
					}
					else 
					{
						pendingBlockList = blockTable;
					}
				} else {
					blockList = blockTable ;
				}
			});
		} else {
			blockList += '<tr><td colspan="6">No blocks found yet</td></tr>';
		}
		$("#blockList").html(blockList);
		$("#newBlockList").html(newBlockList);
		$("#newBlockCount").text(newBlockCount);
		$("#pendingBlockList").html(pendingBlockList);
		$("#pendingBlockCount").text(pendingBlockCount);
		$("#confirmedBlockCount").text(confirmedBlockCount);
		loadStatsData();
	})
	.fail(function () {
		$.notify(
			{
				message: "Error: No response from API.<br>(loadBlocksList)"
			},
			{
				type: "danger",
				timer: 3000
			}
		);
	});
}

// DASHBOARD Load BLOCKS data for miner
async function loadBlocksMinerPage(walletAddress) 
{
	console.log("loadBlocksMinerPage");
	try
	{
		const data = await $.ajax(API + "pools");
		const poolsResponse = data.pools.find(pool => currentPool === pool.id);
		if (!poolsResponse) 
		{
			throw new Error("Pool not found");
		}
		var totalBlocks = poolsResponse.totalBlocks;
		var poolEffort = poolsResponse.poolEffort * 100;
		const PoolblocksResponse = await $.ajax(API + "pools/" + currentPool + "/blocks?page=0&pageSize=" + totalBlocks);
		const blocksResponse = await $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress +"/blocks?page=0&pageSize=" + totalBlocks);
		const MinerResponse = await $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress);
		var MinerEffort = MinerResponse.minerEffort * 100;
		var DashboardBlockList = "";
		var allblocks = 0;
		var pooluncleblocks = 0;
		var poolorphanedblocks = 0;
		var uncleblocks = 0;
		var orphanedblocks = 0;
		var effortsum = 0;
		var minerEffortsum = 0;
		if (blocksResponse.length > 0) {
			$.each(blocksResponse, function(index, value) {
				var createDate = convertUTCDateToLocalDate(new Date(value.created), false);
       			var timeAgo = getTimeAgo(createDate); // Calculate the time difference
				var effort = Math.round(value.effort * 100);
				var minerEffort = Math.round(value.minerEffort * 100);
				var effortClass = "";
				var minerEffortClass = "";
				if (effort < 100) 
				{
					effortClass = "effort1";
				} 
				else if (effort < 200) 
				{
					effortClass = "effort2";
				} 
				else 
				{
					effortClass = "effort3";
				}
				
				if (minerEffort < 100) 
				{
					minerEffortClass = "effort1";
				} 
				else if (minerEffort < 200) 
				{
					minerEffortClass = "effort2";
				} 
				else 
				{
					minerEffortClass = "effort3";
				} 
				
				DashboardBlockList += "<tr>";
				DashboardBlockList += "<td>" + timeAgo + "</td>";
				DashboardBlockList += "<td><a href='" + value.infoLink + "' target='_blank'>" + value.blockHeight + "</a></td>";
				if (typeof value.effort !== "undefined") 
				{
					DashboardBlockList += "<td class='" + effortClass + "'><b>" + effort + "%</b></td>";
				} else {
					DashboardBlockList += "<td>n/a</td>";
				}
					
				if (typeof value.minerEffort !== "undefined") 
				{
					DashboardBlockList += "<td class='" + minerEffortClass + "'><b>" + minerEffort + "%</b></td>";
				} else {
					DashboardBlockList += "<td>n/a</td>";
				}
				var status = value.status;
				DashboardBlockList += "<td>" + _formatter(value.reward, 5, "") + "</td>";
				if (value.type =="uncle") DashboardBlockList += "<td>" + "Uncle" + "</td>";
				else DashboardBlockList += "<td>" + "Block" + "</td>";
				DashboardBlockList += "<td>" + status + "</td>";
				var progressValue = (currentPool.includes("woodcoin")) ? Math.min(Math.round(value.confirmationProgress * 6 * 100), 100) : Math.round(value.confirmationProgress * 100);
				DashboardBlockList += "<td><div class='progress-bar bg-green progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='" + progressValue + "' aria-valuemin='0' aria-valuemax='100' style='width: " + progressValue + "%'><span>" + progressValue + "% Completed</span></div></td>";
				DashboardBlockList += "</tr>";
		  
			});
		} 
		else 
		{
			DashboardBlockList += '<tr><td colspan="6">No blocks found yet</td></tr>';
		}

		for (let i = 0; i < blocksResponse.length; i++)
		{
			const currentBlock = blocksResponse[i];
			if (typeof currentBlock.minerEffort !== "undefined") 
			{
				minerEffortsum = minerEffortsum + (currentBlock.minerEffort * 100);
			}
			if (currentBlock.status === "orphaned") 
			{
				orphanedblocks = orphanedblocks + 1;
			}
			if (currentBlock.type === "uncle") 
			{
				uncleblocks = uncleblocks + 1;
			}
			allblocks = allblocks + 1;
		}
		for (let i = 0; i < PoolblocksResponse.length; i++)
		{
			const currentBlock = PoolblocksResponse[i];
			if (typeof currentBlock.effort !== "undefined") 
			{
				effortsum = effortsum + (currentBlock.effort * 100);
			}
			if (currentBlock.status === "orphaned") 
			{
				poolorphanedblocks = poolorphanedblocks + 1;
			}
			if (currentBlock.type === "uncle") 
			{
				pooluncleblocks = pooluncleblocks + 1;
			}
		}
		effortsum = (effortsum / totalBlocks).toFixed(2);
		pooluncleblocks = (pooluncleblocks / totalBlocks).toFixed(2);
		poolorphanedblocks = (poolorphanedblocks / totalBlocks).toFixed(2);
		minerEffortsum = (minerEffortsum / allblocks).toFixed(2);
		orphanedblocks = (orphanedblocks / allblocks).toFixed(2);
		uncleblocks = (uncleblocks / allblocks).toFixed(2);
		console.log('pooluncleblocks: ',pooluncleblocks);
		console.log('poolorphanedblocks: ',poolorphanedblocks);
		console.log('uncleblocks: ',uncleblocks);
		console.log('orphanedblocks: ',orphanedblocks);

		$("#BlocksEffort").html("Current Effort: " + poolEffort.toFixed(2) +" %" + "<br>Average Effort: " + effortsum + " %");
		$("#MinerEffort").html("Current Effort: " + MinerEffort.toFixed(2) +" %" + "<br>Average Effort: " + minerEffortsum + " %");
		$("#AvgUncleRate").html("Your Rate: " + uncleblocks +" %" + "<br>Pool Rate: " + pooluncleblocks + " %");
		$("#AvgOrphanedRate").html("Your Rate: " + orphanedblocks +" %" + "<br>Pool Rate: " + poolorphanedblocks + " %");

		$("#DashboardBlockList").html(DashboardBlockList);
		
		dataBlockEffort         = [];
		dataMinerEffort         = [];
		dataBlockLabel          = [];
		dataBlockTargetSeries1  = [];
		dataBlockTargetSeries2  = [];
		dataMinerTargetSeries1  = [];
		dataMinerTargetSeries2  = [];
		dataBlockAvgSeries1     = [];
		dataBlockAvgSeries2     = [];
		dataMinerAvgSeries1     = [];
		dataMinerAvgSeries2     = [];
		blocksSeries1           = 10;
		blocksSeries2           = 50;
		dataLength              = 100;
        		    
		var i=1;
		$.each(blocksResponse, function(index2, value2) 
		{
			if (value2.status === "confirmed" || value2.status === "pending") 
			{
				dataBlockEffort.push(value2.effort * 100);
				dataMinerEffort.push(value2.minerEffort * 100);
				if (i>=blocksSeries1) 
				{
					dataBlockTargetSeries1.push(100);
					dataBlockAvgSeries1.push(dataBlockEffort.slice(-blocksSeries1).reduce((a, b) => a + b, 0)/blocksSeries1);
					dataMinerTargetSeries1.push(100);
					dataMinerAvgSeries1.push(dataMinerEffort.slice(-blocksSeries1).reduce((a, b) => a + b, 0)/blocksSeries1);
				}
				if (i>=blocksSeries2) 
				{
					dataBlockTargetSeries2.push(100);
					dataBlockAvgSeries2.push(dataBlockEffort.slice(-blocksSeries2).reduce((a, b) => a + b, 0)/blocksSeries2);
					dataMinerTargetSeries2.push(100);
					dataMinerAvgSeries2.push(dataMinerEffort.slice(-blocksSeries2).reduce((a, b) => a + b, 0)/blocksSeries2);
				}
				i++;
			}
		})
    
		dataBlockAvgSeries1    = dataBlockAvgSeries1.slice(0,(dataBlockAvgSeries2.length<dataLength?dataBlockAvgSeries2.length:dataLength));
		dataBlockAvgSeries2  = dataBlockAvgSeries2.slice(0,(dataBlockAvgSeries2.length<dataLength?dataBlockAvgSeries2.length:dataLength));
		
		dataMinerAvgSeries1    = dataMinerAvgSeries1.slice(0,(dataMinerAvgSeries2.length<dataLength?dataMinerAvgSeries2.length:dataLength));
		dataMinerAvgSeries2  = dataMinerAvgSeries2.slice(0,(dataMinerAvgSeries2.length<dataLength?dataMinerAvgSeries2.length:dataLength));
		
		dataBlockTargetSeries1 = dataBlockTargetSeries1.slice(0,(dataBlockAvgSeries2.length<dataLength?dataBlockAvgSeries2.length:dataLength));
		dataMinerTargetSeries1 = dataMinerTargetSeries1.slice(0,(dataMinerAvgSeries2.length<dataLength?dataMinerAvgSeries2.length:dataLength));
                    
		var y=1;
		do 
		{
			if (dataBlockLabel.length === 0 || (dataBlockLabel.length + 1) % 10 === 0) 
			{
				dataBlockLabel.push((y===1?"Now":y));
			} 
			else 
			{
				dataBlockLabel.push("");
			}
			y++;
		} 
		while (y<=dataBlockAvgSeries1.length);	
                    
		var dataRecentBlocks        = {labels: dataBlockLabel.reverse(),series: [dataBlockAvgSeries1.reverse(),dataBlockAvgSeries2.reverse(),dataBlockTargetSeries1.reverse(),dataMinerAvgSeries1.reverse(),dataMinerAvgSeries2.reverse(),dataMinerTargetSeries1.reverse()]};
		var options		            = {height: "250px",showArea: true,showPoint: false,seriesBarDistance: 1,axisX: {showGrid: true}, axisY: {offset: 43,scale: "logcc",labelInterpolationFnc: function(value) {return _formatter(value, 1, "%");}}, lineSmooth: Chartist.Interpolation.simple({divisor: 3})};
		var responsiveOptions 	  = [["screen and (max-width: 100%)",{axisX: {labelInterpolationFnc: function(value) {return value[1];}}}]];
		Chartist.Line("#chartDashboardBlockEffort",dataRecentBlocks,options,responsiveOptions);
	}
	catch (error) 
	{
		console.error(error);
	}
}

// Load PAYMENTS page content
function loadPaymentsPage() {
  console.log("loadPaymentsPage");
  return $.ajax(API + "pools/" + currentPool + "/payments?page=0&pageSize=500")
    .done(function (data) {
      var paymentList = "";
      if (data.length > 0) {
        $.each(data, function (index, value) {
          var createDate = convertUTCDateToLocalDate(new Date(value.created), false);
          var timeAgo = getTimeAgo(createDate); // Calculate the time difference
          paymentList += '<tr>';
          // paymentList += "<td>" + createDate.toLocaleString('en-US', { hour12: false, timeZoneName: 'short' }) + "</td>";
          paymentList += "<td>" + timeAgo + "</td>";
          paymentList += '<td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address + '</td>';
          // paymentList += '<td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 5) + ' &hellip; ' + value.address.substring(value.address.length - 5) + '</td>';
          paymentList += '<td>' + _formatter(value.amount, 5, '') + '</td>';
          paymentList += '<td colspan="2"><a href="' + value.transactionInfoLink + '" target="_blank">' + value.transactionConfirmationData.substring(0, 5) + ' &hellip; ' + value.transactionConfirmationData.substring(value.transactionConfirmationData.length - 5) + ' </a></td>';
          paymentList += '</tr>';
        });
      } else {
        paymentList += '<tr><td colspan="4">No payments found yet</td></tr>';
      }
      $("#paymentList").html(paymentList);
    })
    .fail(function () {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadPaymentsList)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}

// Load Payments Miner page content
function loadPaymentsMinerPage(walletAddress) {
	return $.ajax(API + "pools/" + currentPool + "/miners/"+ walletAddress + "/payments?page=0&pageSize=500")
	.done(function(data) {
	var lastPaymentList = "";
	if (data.length > 0) {
	$.each(data, function(index, value) {
	var createDate = convertUTCDateToLocalDate(new Date(value.created), false);
	var timeAgo = getTimeAgo(createDate); // Calculate the time difference
        lastPaymentList += '<tr>';
	lastPaymentList += "<td>" + timeAgo + "</td>";
	lastPaymentList += '<td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 12) + ' &hellip; ' + value.address.substring(value.address.length - 12) + '</td>';
	lastPaymentList += '<td>' + _formatter(value.amount, 5, "") + '</td>';
	lastPaymentList += '<td colspan="2"><a href="' + value.transactionInfoLink + '" target="_blank">' + value.transactionConfirmationData.substring(0, 16) + ' &hellip; ' + value.transactionConfirmationData.substring(value.transactionConfirmationData.length - 16) + ' </a></td>';
	lastPaymentList += '</tr>';
	});
	} else {
		lastPaymentList += '<tr><td colspan="4">No Payments Made Yet</td></tr>';
	}
	$("#lastPaymentList").html(lastPaymentList);
	})
	.fail(function() {
	$.notify(
	{message: "Error: No response from API.<br>(loadPaymentsList)"},
	{type: "danger",timer: 3000}
	);
	});
}

// Load Earnings Miner page content
function loadEarningsMinerPage(walletAddress) {
	return $.ajax(API + "pools/" + currentPool + "/miners/"+ walletAddress + "/earnings/daily")
	.done(function(data) {
	var EarningsList = "";
	if (data.length > 0) {
	$.each(data, function(index, value) {
	var createDate = dateConvertor(new Date(value.date),false);
		EarningsList += '<tr>';
		EarningsList += "<td>" + createDate.toLocaleString('en-US', { hour12: false, timeZoneName: 'short' }) + "</td>";
		EarningsList += '<td>' + _formatter(value.amount, 5, "") + '</td>';
		EarningsList += '</tr>';
	});
	} else {
		EarningsList += '<tr><td colspan="4">No Earnings Made Yet</td></tr>';
	}
	$("#EarningsList").html(EarningsList);
	})
	.fail(function() {
	$.notify(
	{message: "Error: No response from API.<br>(loadPaymentsList)"},
	{type: "danger",timer: 3000}
	);
	});
}

// Load CONNECTION page content
function loadConnectPage() {
    return $.ajax(API + "pools")
        .done(function(data) {
            var connectPoolConfig = "";
            $.each(data.pools, function(index, value) {
                if (currentPool === value.id) {
                    defaultPort = Object.keys(value.ports)[0];
                    NicehashPort = (value.ports > 1) ? Object.keys(value.ports)[1] : Object.keys(value.ports)[0];
                    coinName = value.coin.name;
                    coinType = value.coin.type.toLowerCase();
                    coinSite = value.coin.website;
                    coinGithub = value.coin.github;
                    coinExplorer = value.coin.explorer;
                    PoolWallet = value.address;
                    algorithm = value.coin.algorithm;
                    var stratum = "";
                    if (value.coin.family === "ethereum") stratum = "stratum2";
                    else stratum = "stratum";
                    // Connect Pool config table
                    connectPoolConfig += "<tr><td>Crypto Coin Name</td><td>" + coinName + " (" + value.coin.type + ") </td></tr>";
                    connectPoolConfig += "<tr><td>Coin Algorithm</td><td>" + value.coin.algorithm + "</td></tr>";
                    connectPoolConfig += "<tr><td>Coin Reward Type</td><td>" + value.networkStats.rewardType + "</td></tr>";
                    connectPoolConfig += '<tr><td>Pool Wallet</td><td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 12) + " &hellip; " + value.address.substring(value.address.length - 12) + "</a></td></tr>";
                    connectPoolConfig += "<tr><td>Payout Scheme</td><td>" + value.paymentProcessing.payoutScheme + "</td></tr>";
                    connectPoolConfig += "<tr><td>Minimum Payment</td><td>" + value.paymentProcessing.minimumPayment + " " + value.coin.type + "</td></tr>";
                    if (typeof value.paymentProcessing.minimumPaymentToPaymentId !== "undefined") {
                        connectPoolConfig += "<tr><td>Minimum Payout (to Exchange)</td><td>" + value.paymentProcessing.minimumPaymentToPaymentId + "</td></tr>";
                    }
                    connectPoolConfig += "<tr><td>Pool Fee</td><td>" + value.poolFeePercent + "%</td></tr>";
                    $.each(value.ports, function(port, options) {
                        connectPoolConfig += "<tr><td>" + stratumAddress + ":" + port + "</td><td>";
                        if (typeof options.varDiff !== "undefined" && options.varDiff != null) {
                            connectPoolConfig += "Difficulty Variable / " + options.varDiff.minDiff + " &harr; ";
                            if (typeof options.varDiff.maxDiff === "undefined" || options.varDiff.maxDiff == null) {
                                connectPoolConfig += "&infin; ";
                            } else {
                                connectPoolConfig += options.varDiff.maxDiff;
                            }
                        } else {
                            connectPoolConfig += "Difficulty Static / " + options.difficulty;
                        }
                        connectPoolConfig += "</td></tr>";
                    });

                    $.each(value.ports, function(port, options) {
                        connectPoolConfig += "<tr><td>" + stratumAddressUS + ":" + port + "</td><td>";
                        if (typeof options.varDiff !== "undefined" && options.varDiff != null) {
                            connectPoolConfig += "Difficulty Variable / " + options.varDiff.minDiff + " &harr; ";
                            if (typeof options.varDiff.maxDiff === "undefined" || options.varDiff.maxDiff == null) {
                                connectPoolConfig += "&infin; ";
                            } else {
                                connectPoolConfig += options.varDiff.maxDiff;
                            }
                        } else {
                            connectPoolConfig += "Difficulty Static / " + options.difficulty;
                        }
                        connectPoolConfig += "</td></tr>";
                    });

                    $.each(value.ports, function(port, options) {
                        connectPoolConfig += "<tr><td>" + stratumAddressJP + ":" + port + "</td><td>";
                        if (typeof options.varDiff !== "undefined" && options.varDiff != null) {
                            connectPoolConfig += "Difficulty Variable / " + options.varDiff.minDiff + " &harr; ";
                            if (typeof options.varDiff.maxDiff === "undefined" || options.varDiff.maxDiff == null) {
                                connectPoolConfig += "&infin; ";
                            } else {
                                connectPoolConfig += options.varDiff.maxDiff;
                            }
                        } else {
                            connectPoolConfig += "Difficulty Static / " + options.difficulty;
                        }
                        connectPoolConfig += "</td></tr>";
                    });

                }
            });
            connectPoolConfig += "</tbody>";
            $("#connectPoolConfig").html(connectPoolConfig);
            $("#miner-config").html("");
            $("#miner-config").load("poolconfig/" + coinType + ".html",
                function(response, status, xhr) {
                    if (status == "error") {
                        $("#miner-config").load("poolconfig/default.html",
                            function(responseText) {
                                var config = $("#miner-config")
                                    .html()
                                    .replace(/{{ stratumAddress }}/g, "" + stratumAddress + ":" + defaultPort)


                                    .replace(/{{ stratumAddressUS }}/g, "" + stratumAddressUS + ":" + defaultPort)
                                    .replace(/{{ stratumAddressJP }}/g, "" + stratumAddressJP + ":" + defaultPort)
                                    .replace(/{{ coinName }}/g, coinName)
                                    .replace(/{{ aglorithm }}/g, algorithm);
                                $(this).html(config);
                            });
                    } else {
                        var config = $("#miner-config")
                            .html()
                            .replace(/{{ stratumAddress }}/g, "" + stratumAddress + ":" + defaultPort)


                            .replace(/{{ stratumAddressUS }}/g, "" + stratumAddressUS + ":" + defaultPort)
                            .replace(/{{ stratumAddressJP }}/g, "" + stratumAddressJP + ":" + defaultPort)
                            .replace(/{{ coinName }}/g, coinName)
                            .replace(/{{ aglorithm }}/g, algorithm);
                        $(this).html(config);
                    }
                }
            );
        })
        .fail(function() {
            $.notify({
                message: "Error: No response from API.<br>(loadConnectConfig)"
            }, {
                type: "danger",
                timer: 3000
            });
        });
}


// Dashboard - load wallet stats
function loadWallet() {
	console.log( 'Loading wallet address:',$("#walletAddress").val() );
	if ($("#walletAddress").val().length > 0) {
		localStorage.setItem(currentPool + "-walletAddress", $("#walletAddress").val() );
	}
	var coin = window.location.hash.split(/[#/?]/)[1];
	var currentPage = window.location.hash.split(/[#/?]/)[2] || "stats";
	window.location.href = "#" + currentPool + "/" + currentPage + "?address=" + $("#walletAddress").val();
}

// General formatter function
function _formatter(value, decimal, unit) {
  if (value === 0) {
    return "0 " + unit;
  } else {
    var si = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
      { value: 1e21, symbol: "Z" },
      { value: 1e24, symbol: "Y" }
    ];
    for (var i = si.length - 1; i > 0; i--) {
      if (value >= si[i].value) {
        break;
      }
    }
    return ((value / si[i].value).toFixed(decimal).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + " " + si[i].symbol + unit);
  }
}


// Time convert Local -> UTC
function convertLocalDateToUTCDate(date, toUTC) {
  date = new Date(date);
  //Local time converted to UTC
  var localOffset = date.getTimezoneOffset() * 60000;
  var localTime = date.getTime();
  if (toUTC) {
    date = localTime + localOffset;
  } else {
    date = localTime - localOffset;
  }
  newDate = new Date(date);
  return newDate;
}


// Time convert UTC -> Local
function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    var localOffset = date.getTimezoneOffset() / 60;
    var hours = date.getUTCHours();
    newDate.setHours(hours - localOffset);
    return newDate;
}

// Function to calculate the time difference between now and a given date
function getTimeAgo(date) {
  var now = new Date();
  var diff = now.getTime() - date.getTime();
  var seconds = Math.floor(diff / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  var months = Math.floor(days / 30);

  if (days >= 30) {
    return months + " month" + (months > 1 ? "s" : "") + " ago";
  } else if (days >= 1 && days <= 30) {
    return days + " day" + (days > 1 ? "s" : "") + " ago";
  } else if (hours >= 1) {
    return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
  } else if (minutes >= 1) {
    return minutes + " mins ago";
  } else if (seconds >= 1 ){
    return seconds + " secs ago";
  } else {
    return "Unavailable";
  }
}

// String convert -> Date
function dateConvertor(date){
   var options = {  
     year: "numeric",  
     month: "numeric",  
     day: "numeric"
   };  

   var newDateFormat = new Date(date).toLocaleDateString("en-US", options); 
   var newTimeFormat = new Date(date).toLocaleTimeString();  
   var dateAndTime = newDateFormat +' '+ newTimeFormat        
   return dateAndTime
}

// String Convert -> Seconds
function readableSeconds(t) {
	var seconds = Math.floor(t % 3600 % 60);
	var minutes = Math.floor(t % 3600 / 60);
	var hours = Math.floor(t % 86400 / 3600);
	var days = Math.floor(t % 604800 / 86400);	
	var weeks = Math.floor(t % 2629799.8272 / 604800);
	var months = Math.floor(t % 31557597.9264 / 2629799.8272);
	var years = Math.floor(t / 31557597.9264);

	var sYears = years > 0 ? years + ((years== 1) ? "y" : "y") : "";
	var sMonths = months > 0 ? ((years > 0) ? " " : "") + months + ((months== 1) ? "mo" : "mo") : "";
	var sWeeks = weeks > 0 ? ((years > 0 || months > 0) ? " " : "") + weeks + ((weeks== 1) ? "w" : "w") : "";
	var sDays = days > 0 ? ((years > 0 || months > 0 || weeks > 0) ? " " : "") + days + ((days== 1) ? "d" : "d") : "";
	var sHours = hours > 0 ? ((years > 0 || months > 0 || weeks > 0 || days > 0) ? " " : "") + hours + (hours== 1 ? "h" : "h") : "";
	var sMinutes = minutes > 0 ? ((years > 0 || months > 0 || weeks > 0 || days > 0 || hours > 0) ? " " : "") + minutes + (minutes == 1 ? "m" : "m") : "";
	var sSeconds = seconds > 0 ? ((years > 0 || months > 0 || weeks > 0 || days > 0 || hours > 0 || minutes > 0) ? " " : "") + seconds + (seconds == 1 ? "s" : "s") : ((years < 1 && months < 1 && weeks < 1 && days < 1 && hours < 1 && minutes < 1 ) ? " Few milliseconds" : "");
	if (seconds > 0) return sYears + sMonths + sWeeks + sDays + sHours + sMinutes + sSeconds;
	else return "&#8734;";
}

// Time Different Calculation
function timeDiff(tstart, tend) {
  var diff = Math.floor((tend - tstart) / 1000),
    units = [
      { d: 60, l: "s" },
      { d: 60, l: "m" },
      { d: 24, l: "h" },
      { d: 7, l: "d" },
    ];
  var s = "";
  for (var i = 0; i < units.length; ++i) {
    s = (diff % units[i].d) + units[i].l + " " + s;
    diff = Math.floor(diff / units[i].d);
  }
  return s;
}

// Time Different Calculation To Seconds
function timeDiffSec(tstart, tend) {
  var diff = Math.floor((tend - tstart) / 1000),
    units = [{ d: 60, l: " seconds" }];
  var s = "";
  for (var i = 0; i < units.length; ++i) {
    s = (diff % units[i].d) + units[i].l + " " + s;
    diff = Math.floor(diff / units[i].d);
  }
  return s;
}

// Scroll to top off page
function scrollPageTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  var elmnt = document.getElementById("page-scroll-top");
  elmnt.scrollIntoView();
}


// Check if file exits
function doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
     
    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}

async function loadStatsData() 
{
	console.log('Loading stats data...');
	try 
	{
		const data = await $.ajax(API + "pools");
		const value = data.pools.find(pool => currentPool === pool.id);
		if (!value) 
		{
			throw new Error("Pool not found");
		}

		var getcoin_price = 0;
		
		var totalBlocks = value.totalBlocks;
		var poolEffort = value.poolEffort * 100;
		$("#blockchainHeight").text(value.networkStats.blockHeight.toLocaleString());
		$("#poolBlocks2").text(totalBlocks.toLocaleString());
		$("#connectedPeers").text(value.networkStats.connectedPeers);
		$("#minimumPayment").html(`${value.paymentProcessing.minimumPayment.toLocaleString()} ${value.coin.type}<br>(${value.paymentProcessing.payoutScheme})`);
		$("#totalPaid").html(value.totalPaid.toLocaleString() + " " +  value.coin.type );
		$("#totalPaid2").html(value.totalPaid.toLocaleString() + " " +  value.coin.type );
		$("#poolFeePercent").text(`${value.poolFeePercent} %`);
		$("#poolHashRate").text(_formatter(value.poolStats.poolHashrate, 2, "H/s"));
		$("#poolMiners").text(`${value.poolStats.connectedMiners} Miner(s)`);
		$("#networkHashRate").text(_formatter(value.networkStats.networkHashrate, 2, "H/s"));
		$("#networkDifficulty").text(_formatter(value.networkStats.networkDifficulty, 5, ""));
		const blocksResponse = await $.ajax(API + "pools/" + currentPool + "/blocks?page=0&pageSize=50000");
		let pendingCount = 0;
		for (let i = 0; i < blocksResponse.length; i++) 
		{
			const currentBlock = blocksResponse[i];
			if (currentBlock.status === "pending") 
			{
				pendingCount++;
			}
		}
		let confirmedCount = 0;
		for (let i = 0; i < blocksResponse.length; i++) 
		{
			const currentBlock = blocksResponse[i];
			if (currentBlock.status === "confirmed") 
			{
				confirmedCount++;
			}
		}
		// console.log("Total Pending Blocks:", pendingCount);

		let reward = 0;
		for (let i = 0; i < blocksResponse.length; i++) 
		{
			const currentBlock = blocksResponse[i];
			if (currentBlock.status === "confirmed") 
			{
				reward = currentBlock.reward;
				break;
			}
		}

		let effortsum = 0;
		let allblocks = 0;
		for (let i = 0; i < blocksResponse.length; i++)
		{
			const currentBlock = blocksResponse[i];
			if (typeof currentBlock.effort !== "undefined") 
			{
				effortsum = effortsum + (currentBlock.effort * 100);
				allblocks = allblocks + 1;
			}
		}
		effortsum = (effortsum / allblocks).toFixed(2);
		console.log('Average pool effort: ',effortsum);
		$("#poolEffort").html("Current Effort:" + poolEffort.toFixed(2) +" %" + "<br>Average Effort: " + effortsum + " %");

		var networkHashRate = value.networkStats.networkHashrate;
		var poolHashRate = value.poolStats.poolHashrate;
		if (blocksResponse.length > 0) 
		{
			var ancientBlock = blocksResponse[blocksResponse.length - 1];
			var recentBlock = blocksResponse[0];
			var MostRecentBlockTime = recentBlock.created;
			var MostRecentBlockHeight = recentBlock.blockHeight;
			var MostAncientBlockTime = ancientBlock.created;
			var MostAncientBlockHeight = ancientBlock.blockHeight;
			var MostRecentBlockTimeInSeconds = new Date(MostRecentBlockTime).getTime() / 1000;
			var MostAncientBlockTimeInSeconds = new Date(MostAncientBlockTime).getTime() / 1000;
			var blockTime = (MostRecentBlockTimeInSeconds - MostAncientBlockTimeInSeconds) / (MostRecentBlockHeight - MostAncientBlockHeight);
			var ttf_blocks = (networkHashRate / poolHashRate) * blockTime;
			var NetworkBlocks24hrs = (86400 / blockTime);
			var NetworkEmissionsPerDay = (NetworkBlocks24hrs * reward);
			var PoolBlocks24hrs = (86400 / ttf_blocks)
			var PoolEmissionsPerDay = (PoolBlocks24hrs * reward);
		} 
		else 
		{
			var blockTime = value.blockRefreshInterval;
			var ttf_blocks = (networkHashRate / poolHashRate) * blockTime;
			var NetworkBlocks24hrs = (86400 / blockTime);
			var NetworkEmissionsPerDay = (NetworkBlocks24hrs * reward);
			var PoolBlocks24hrs = (86400 / ttf_blocks)
			var PoolEmissionsPerDay = (PoolBlocks24hrs * reward);
		}
		$("#text_TTFBlocks").html("Net. Blocktime: " + formatTime(blockTime) + "<br>Pool TTF: " + readableSeconds(ttf_blocks));
		$("#text_BlockReward").text(reward.toLocaleString() + " (" + value.coin.type + ")");
		$("#text_BlocksPending").text(pendingCount.toLocaleString());
		$("#poolBlocks").text(confirmedCount.toLocaleString());
		$("#blockreward").text(reward.toLocaleString() + " (" + value.coin.type + ")");

		if(value.coin.type == "SKYDOGE")
		{
			const XeggexResponse = await $.ajax("https://api.xeggex.com/api/v2/market/getbysymbol/SKY%2FUSDT");
			var getcoin_price = XeggexResponse.lastPrice;
			var NetworkEmissionsPerDayDollars = (NetworkEmissionsPerDay * getcoin_price);
			var PoolEmissionsPerDayDollars = (PoolEmissionsPerDay * getcoin_price);
		}
		else if(value.coin.type == "LOG")
		{
			var coinname = value.coin.name.toLowerCase();
			const CoingeckoResponse = await $.ajax("https://api.coingecko.com/api/v3/simple/price?ids=" + coinname + "&vs_currencies=usd");
			var getcoin_price = CoingeckoResponse[coinname]['usd'];
			var NetworkEmissionsPerDayDollars = (NetworkEmissionsPerDay * getcoin_price);
			var PoolEmissionsPerDayDollars = (PoolEmissionsPerDay * getcoin_price);
		}
		else if(value.coin.type == "MBC" || value.coin.type == "GEC" || value.coin.type == "ETX" || value.coin.type == "ISO")
		{
			const bitxonexResponse = await $.ajax("https://www.bitxonex.com/api/v2/trade/public/markets/" + value.coin.type.toLowerCase() + "usdt/tickers");
			var getcoin_price = bitxonexResponse.ticker.last;
			var NetworkEmissionsPerDayDollars = (NetworkEmissionsPerDay * getcoin_price);
			var PoolEmissionsPerDayDollars = (PoolEmissionsPerDay * getcoin_price);
		}
		else if(value.coin.type == "REDE")
		{
			const XeggexResponse = await $.ajax("https://api.xeggex.com/api/v2/market/getbysymbol/REDEV2%2FUSDT");
			var getcoin_price = XeggexResponse.lastPrice;
			var NetworkEmissionsPerDayDollars = (NetworkEmissionsPerDay * getcoin_price);
			var PoolEmissionsPerDayDollars = (PoolEmissionsPerDay * getcoin_price);
		}
		else
		{
			$.ajax("https://api.xeggex.com/api/v2/market/getbysymbol/"+ value.coin.type +"%2FUSDT").done(function(data)
			{
				var	getcoin_price = data['lastPrice'];
				var NetworkEmissionsPerDayDollars = (NetworkEmissionsPerDay * getcoin_price);
				var PoolEmissionsPerDayDollars = (PoolEmissionsPerDay * getcoin_price);
				$("#value").html("Coin Price: " + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price) + "<br>Block Value: " + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6, minimumFractionDigits: 0}).format(getcoin_price * reward));
				$("#Emissions").html("Network: " + _formatter(NetworkEmissionsPerDay, 3, "") + " " + value.coin.type + " (" + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(NetworkEmissionsPerDayDollars) +") <br>" + "Pool: " + _formatter(PoolEmissionsPerDay, 2, "") + " " + value.coin.type + " (" + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(PoolEmissionsPerDayDollars) + ")");
				$("#coinvalue").html("Coin Price: " + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price) + "<br>Block Value: " + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6, minimumFractionDigits: 0}).format(getcoin_price * reward));
			}).fail(function() 
			{
				var	getcoin_price = 0;
				var NetworkEmissionsPerDayDollars = (NetworkEmissionsPerDay * getcoin_price);
				var PoolEmissionsPerDayDollars = (PoolEmissionsPerDay * getcoin_price);
				$("#value").html("Coin Price: " + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price) + "<br>Block Value: " + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6, minimumFractionDigits: 0}).format(getcoin_price * reward));
				$("#Emissions").html("Network: " + _formatter(NetworkEmissionsPerDay, 3, "") + " " + value.coin.type + " (" + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(NetworkEmissionsPerDayDollars) +") <br>" + "Pool: " + _formatter(PoolEmissionsPerDay, 2, "") + " " + value.coin.type + " (" + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(PoolEmissionsPerDayDollars) + ")");
				$("#coinvalue").html("Coin Price: " + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price) + "<br>Block Value: " + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6, minimumFractionDigits: 0}).format(getcoin_price * reward));
			});
		} 
		$("#value").html("Coin Price: " + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price) + "<br>Block Value: " + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6, minimumFractionDigits: 0}).format(getcoin_price * reward));
		$("#Emissions").html("Network: " + _formatter(NetworkEmissionsPerDay, 3, "") + " " + value.coin.type + " (" + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(NetworkEmissionsPerDayDollars) +") <br>" + "Pool: " + _formatter(PoolEmissionsPerDay, 2, "") + " " + value.coin.type + " (" + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(PoolEmissionsPerDayDollars) + ")");
		$("#coinvalue").html("Coin Price: " + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 9, minimumFractionDigits: 0}).format(getcoin_price) + "<br>Block Value: " + Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6, minimumFractionDigits: 0}).format(getcoin_price * reward));

		loadWorkerTTFBlocks();
	} 
	catch (error) 
	{
		console.error(error);
	}
}

// STATS page charts
function loadStatsChart() {
  return $.ajax(API + "pools/" + currentPool + "/performance")
    .done(function(data) {
      labels = [];
	  
	  poolHashRate = [];
      networkHashRate = [];
      networkDifficulty = [];
      connectedMiners = [];
      connectedWorkers = [];
      
      $.each(data.stats, function(index, value) {
        if (labels.length === 0 || (labels.length + 1) % 2 === 1) {
          var createDate = convertLocalDateToUTCDate(new Date(value.created),false);
          labels.push(createDate.getHours() + ":00");
        } else {
          labels.push("");
        }
		poolHashRate.push(value.poolHashrate);
        networkHashRate.push(value.networkHashrate);
		networkDifficulty.push(value.networkDifficulty);
        connectedMiners.push(value.connectedMiners);
        connectedWorkers.push(value.connectedWorkers);
      });
	  
      var dataPoolHash          = {labels: labels,series: [poolHashRate]};
      var dataNetworkHash       = {labels: labels,series: [networkHashRate]};
      var dataNetworkDifficulty = {labels: labels,series: [networkDifficulty]};
      var dataMiners            = {labels: labels,series: [connectedMiners,connectedWorkers]};
	  
	  var options = {
		height: "200px",
        showArea: false,
        seriesBarDistance: 1,
        // low:Math.min.apply(null,networkHashRate)/1.1,
        axisX: {
          showGrid: false
        },
        axisY: {
          offset: 47,
          scale: "logcc",
          labelInterpolationFnc: function(value) {
            return _formatter(value, 1, "");
          }
        },
        lineSmooth: Chartist.Interpolation.simple({
          divisor: 2
        })
      };
	  
      var responsiveOptions = [
        [
          "screen and (max-width: 320px)",
          {
            axisX: {
              labelInterpolationFnc: function(value) {
                return value[1];
              }
            }
          }
        ]
      ];
      Chartist.Line("#chartStatsHashRate", dataNetworkHash, options, responsiveOptions);
      Chartist.Line("#chartStatsHashRatePool",dataPoolHash,options,responsiveOptions);
      Chartist.Line("#chartStatsDiff", dataNetworkDifficulty, options, responsiveOptions);
      Chartist.Line("#chartStatsMiners", dataMiners, options, responsiveOptions);
 
    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadStatsChart)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}

// Seconds to Days/hours/minutes/seconds
function formatTime(timeInSeconds) 
{
	var days = Math.floor(timeInSeconds / (3600 * 24));
	timeInSeconds = timeInSeconds % (3600 * 24);
	var hours = Math.floor(timeInSeconds / 3600);
	timeInSeconds = timeInSeconds % 3600;
	var minutes = Math.floor(timeInSeconds / 60);
	var seconds = Math.floor(timeInSeconds % 60);
	var result = "";
	if (days > 0) 
	{
		result += days + "d ";
	}
	if (hours > 0 || result.length > 0) {
		result += hours + "h ";
	}
	if (minutes > 0 || result.length > 0) {
		result += minutes + "m ";
	}
	result += seconds + "s";
	return result;
}

// Milliseconds to Days/hours/minutes/seconds
function formatMilliseconds(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000) % 60;
  let minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
  let hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
  let days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  let result = "";
  if (days > 0) result += days + "d ";
  if (hours > 0) result += hours + "h ";
  if (minutes > 0) result += minutes + "m ";
  result += seconds + "s";
  return result;
}

// DASHBOARD page data
function loadUserBalanceData(walletAddress) {
	console.log('Loading user balance data...');
	return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress + "/payments")
	.done(function (data) {
		if (data.length > 0)
		{
			var datetime = data[0].created;
			var date = datetime.split("T")[0];
			var time = datetime.split("T")[1].split(".")[0];
			var currentTime = new Date();
			var createdTime = new Date(datetime);
			var timeDifference = currentTime - createdTime;
			$("#lastPayment").html(formatMilliseconds(timeDifference) + " ago" + "<br>" + "Amount: " + _formatter(data[0].amount, 5, ""));
		}
		else 
		{
			$("#lastPayment").html("No payments received");
		}
    })
    .fail(function () {
      $.notify({
        message: "Error: No response from API.<br>(UserBalanceData)"
      },
        {
          type: "danger",
          timer: 3000
        }
      );
    }
  );
}

// Worker TTF Blocks
async function loadWorkerTTFBlocks(walletAddress) {
	console.log("Loading worker TTF Blocks");
	try 
	{
		const response = await $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress);
		var workerHashRate = 0;
		var workerSharesPerSecond = 0;
		var pendingShares = response.pendingShares
		if (response.performance) 
		{
			$.each(response.performance.workers, function (index, value) 
			{
				workerHashRate += value.hashrate;
				workerSharesPerSecond += value.sharesPerSecond
			});
			// console.log("Worker Shares Per Second: " + workerSharesPerSecond);

			const minersResponse = await $.ajax(API + "pools/" + currentPool + "/miners?page=0&pagesize=50");
			const sharesPerSecond = minersResponse.map(miner => miner.sharesPerSecond);
			var totalPoolSharesPerSecond = sharesPerSecond.reduce((sum, value) => sum + value, 0);
			var minersShareRatio = workerSharesPerSecond / totalPoolSharesPerSecond;
			// console.log("Miners Share Ratio: " + minersShareRatio);
			// console.log("Total Pool Shares Per Second: " + totalPoolSharesPerSecond);
			// console.log("Miners Shares Per Second: " + workerSharesPerSecond);

			const poolsResponse = await $.ajax(API + "pools");
			var blockHeights = [];
			var blockTimes = [];
			$.each(poolsResponse.pools, async function (index, value) 
			{
				if (currentPool === value.id) 
				{
					var networkHashRate = value.networkStats.networkHashrate;
					var poolHashRate = value.poolStats.poolHashrate;
					var poolFeePercentage = value.poolFeePercent;
					var currentBlockheight = value.networkStats.blockHeight;
					var currentBlockheightTime = value.networkStats.lastNetworkBlockTime;
					blockHeights.push(currentBlockheight);
					blockTimes.push(currentBlockheightTime);
					if (blockHeights.length > 1000) 
					{
						blockHeights.shift();
						blockTimes.shift();
					}
					var totalTime = 0;
					for (var i = 1; i < blockHeights.length; i++) 
					{
						var timeDifference = blockTimes[i] - blockTimes[i - 1];
						totalTime += timeDifference;
					}
					var averageTime = totalTime / (blockHeights.length - 1);
					// console.log("Average block time: " + averageTime + " ms");
					
					const blocksResponse = await $.ajax(API + "pools/" + currentPool + "/blocks?page=0&pageSize=1000");
					let pendingCount = 0;
					for (let i = 0; i < blocksResponse.length; i++) 
					{
						const currentBlock = blocksResponse[i];
						if (currentBlock.status === "pending") 
						{
							pendingCount++;
						}
					}
					let confirmedCount = 0;
					for (let i = 0; i < blocksResponse.length; i++) 
					{
						const currentBlock = blocksResponse[i];
						if (currentBlock.status === "confirmed") 
						{
							confirmedCount++;
						}
					}
					// console.log("Total Pending Blocks:", pendingCount);

					let reward = 0;
					for (let i = 0; i < blocksResponse.length; i++) 
					{
						const currentBlock = blocksResponse[i];
						if (currentBlock.status === "confirmed") 
						{
							reward = currentBlock.reward;
							break;
						}
					}

					const blocks2Response = await $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress+ "/blocks?page=0&pageSize=1000");
					var blocksConfirmedByMiner = 0;
					for (let i = 0; i < blocks2Response.length; i++) 
					{
						const currentBlock = blocks2Response[i];
						if (currentBlock.status === "confirmed") 
						{
							blocksConfirmedByMiner++;
						}
					}
					var blocksPendingByMiner = 0;
					for (let i = 0; i < blocks2Response.length; i++) 
					{
						const currentBlock = blocks2Response[i];
						if (currentBlock.status === "pending") 
						{
							blocksPendingByMiner++;
						}
					}
					var totalCoinsPending = (pendingCount * reward)
					var poolFeePercentage = (poolFeePercentage / 100);
					var workersPoolSharePercent = (workerHashRate / poolHashRate);
					var workersNetSharePercent = (workerHashRate / networkHashRate);
					var immatureWorkerBalance = ((totalCoinsPending * poolFeePercentage) * minersShareRatio) * 100;
					var immatureWorkerBalance2 = ((totalCoinsPending * poolFeePercentage) * workersPoolSharePercent) * 100;
					if (blocksResponse.length > 0)
					{
						var ancientBlock = blocksResponse[blocksResponse.length - 1];
						var recentBlock = blocksResponse[0];
						var MostRecentBlockTime = recentBlock.created;
						var MostRecentBlockHeight = recentBlock.blockHeight;
						var MostAncientBlockTime = ancientBlock.created;
						var MostAncientBlockHeight = ancientBlock.blockHeight;
						var MostRecentBlockTimeInSeconds = new Date(MostRecentBlockTime).getTime() / 1000;
						var MostAncientBlockTimeInSeconds = new Date(MostAncientBlockTime).getTime() / 1000;
						var blockTime = (MostRecentBlockTimeInSeconds - MostAncientBlockTimeInSeconds) / (MostRecentBlockHeight - MostAncientBlockHeight);
						var ttf_blocks = (networkHashRate / workerHashRate) * blockTime;
						var blocksPer24Hrs = (86400 / ttf_blocks);
						var MinersCoin = (reward) * (86400 / blockTime) * (workerHashRate / networkHashRate);
						$("#MinersCoins").html("Coins: " + MinersCoin.toLocaleString() + "<br>" + "Blocks: " + blocksPer24Hrs.toFixed(2));
						$("#MinersShare").html("Pool Share: " + _formatter((workersPoolSharePercent) * 100, 2, "%") + "<br>" + "Net. Share: " + _formatter((workersNetSharePercent) * 100, 2, "%"));
						$("#BlocksByMiner").html("Pending: " + blocksPendingByMiner + "<br>" + "Confirmed: " + blocksConfirmedByMiner);
						$("#TTF_Blocks").html(readableSeconds(ttf_blocks));
						$("#Blocktime").html(formatTime(blockTime));
						$("#pendingBalance").html(("Shares: " + _formatter(pendingShares, 2, "") + "<br>" + "Coins: " + Intl.NumberFormat().format(immatureWorkerBalance2)));
						$("#ConfirmedBlocks").text(confirmedCount.toLocaleString());
					}
					else
					{
						var blockTime = value.blockRefreshInterval;
						var ttf_blocks = (networkHashRate / workerHashRate) * blockTime;
						var blocksPer24Hrs = (86400 / ttf_blocks);
						var MinersCoin = (reward) * (86400 / blockTime) * (workerHashRate / networkHashRate);
						$("#MinersCoins").html("Coins: " + MinersCoin.toLocaleString() + "<br>" + "Blocks: " + blocksPer24Hrs.toFixed(2));
						$("#MinersShare").html("Pool Share: " + _formatter((workersPoolSharePercent) * 100, 2, "%") + "<br>" + "Net. Share: " + _formatter((workersNetSharePercent) * 100, 2, "%"));
						$("#BlocksByMiner").html("Pending: " + blocksPendingByMiner + "<br>" + "Confirmed: " + blocksConfirmedByMiner);
						$("#TTF_Blocks").html(readableSeconds(ttf_blocks));
						$("#Blocktime").html(formatTime(blockTime));
						$("#pendingBalance").html(("Shares: " + _formatter(pendingShares, 2, "") + "<br>" + "Coins: " + Intl.NumberFormat().format(immatureWorkerBalance2)));
						$("#ConfirmedBlocks").text(confirmedCount.toLocaleString());
					}
					var minimumPayment = value.paymentProcessing.minimumPayment.toLocaleString();
					$.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress + "/settings").done(function(data){
						var paymentThreshold = data['paymentThreshold'];
						$("#minPayment").html(paymentThreshold + " " + "(" + value.coin.type + ")" + "<br>" + "(" + value.paymentProcessing.payoutScheme + ")");
					})
					.fail(function() 
					{
						$("#minPayment").html(minimumPayment + " " + "(" + value.coin.type + ")" + "<br>" + "(" + value.paymentProcessing.payoutScheme + ")");
					});
				}
			});
		}
	} catch (error) {
		console.error(error);
	}
}

// Load Dashboard page data
function loadDashboardData(walletAddress) {
	console.log('Loading dashboard data...');
	return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress)
	.done(function (data) 
	{
		$("#pendingShares").text("Shares: " + _formatter(data.pendingShares, 3, ""));
		var workerHashRate = 0;
		var bestWorker = null;
		if (data.performance) 
		{
			$.each(data.performance.workers, function (index, value) 
			{
				workerHashRate += value.hashrate;
				if (!bestWorker || value.hashrate > bestWorker.hashrate) 
				{
					bestWorker = { name: index, hashrate: value.hashrate };
				}
			});
		}
		$("#minerHashRate").text(_formatter(workerHashRate, 3, "H/s"));
		$("#pendingBalance2").text(_formatter(data.pendingBalance, 2, ""));
		$("#paidBalance").html("24hr Paid: " + _formatter(data.todayPaid, 2, "") + "<br>" + "Lifetime Paid: " + _formatter(data.pendingBalance + data.totalPaid, 2, ""));
		$("#lifetimeBalance").text(_formatter(data.pendingBalance + data.totalPaid, 2, ""));
		if (bestWorker && bestWorker.name) 
		{
			$("#BestminerHashRate").text(bestWorker.name + ": " + _formatter(bestWorker.hashrate, 2, "H/s"));
		} 
		else 
		{
			$("#BestminerHashRate").text("N/A");
		}
		if (data.totalPaid === 0) 
		{
			$("#lastPaymentLink").html("No payments received");
		} 
		else 
		{
			$("#lastPaymentLink").html("Explorer: <a href='" + data.lastPaymentLink + "' target='_blank'>" + "Click Here" + "</a>");
		}
		loadHomePage();
    })
    .fail(function () {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadDashboardData)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}
// DASHBOARD page Miner table
async function loadDashboardWorkerList(walletAddress)
{
	console.log('Loading Worker List...');
	try
	{
		const response = await $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress);
		const data = await $.ajax(API + "pools");
		const poolsResponse = data.pools.find(pool => currentPool === pool.id);
		const blocksResponse = await $.ajax(API + "pools/" + currentPool + "/blocks?page=0&pageSize=50000");
		if (!poolsResponse) 
		{
			throw new Error("Pool not found");
		}
		
		var workerList = "";
		if (response.performance) 
		{
			var workerCount = 0;
			var minerTotalHashRep   = 0;
			var minerTotalHash      = 0;
			var minerTotalHash2     = 0;
			var minerTotalHash3     = 0;
			var minerTotalEarn      = 0;
			var workerHashRate = 0;
			var workerSharesPerSecond = 0;
			var minerTotalSharesPerSecond = 0;
			var coinsymbol = poolsResponse.coin.type;
				
			$.each(response.performance.workers, function(index, value) 
			{
				var hashSum         = 0;
				var hashSum2        = 0;
				var hashSum3        = 0;
				var newDate         = new Date().getTime();
				var periodHours     = 6;
				var periodHours2    = 12;
				var periodHours3    = 24; 
				
				workerHashRate = value.hashrate;
				workerSharesPerSecond = value.sharesPerSecond;
				minerTotalSharesPerSecond += value.sharesPerSecond;
				
				$.each(response.performanceSamples, function(index2, value2) 
				{
					var dateJson = convertLocalDateToUTCDate(new Date(value2.created),false).getTime();
					if (newDate-dateJson < (periodHours * 1.5 * 3600000) && index2 >= response.performanceSamples.length -periodHours) 
					{
						$.each(value2.workers, function(index3, value3) 
						{
							if (index3 === index) 
							{
								hashSum += value3.hashrate;
							}
						});
					}
					if (newDate-dateJson < (periodHours2 * 1.5 * 3600000) && index2 >= response.performanceSamples.length -periodHours2) 
					{
						$.each(value2.workers, function(index3, value3) 
						{
							if (index3 === index) 
							{
								hashSum2 += value3.hashrate;
							}
						});
					}
					$.each(value2.workers, function(index3, value3) 
					{
						if (index3 === index) 
						{
							hashSum3 += value3.hashrate;
						}
					});
				}); 
			
				var hashAvg         = hashSum/periodHours;
				var hashAvg2        = hashSum2/periodHours2;
				var hashAvg3        = hashSum3/periodHours3;
				minerTotalHash      += hashAvg;
				minerTotalHash2     += hashAvg2;
				minerTotalHash3     += hashAvg3;
				minerTotalHashRep   += value.hashrate;
			
				if (hashSum     === 0) { hashAvg    = "" }
				if (hashSum2    === 0) { hashAvg2   = "" }
				if (hashSum2    === 0) { hashAvg3   = "" }
			
				var blockHeights = [];
				var blockTimes = [];
				var networkHashRate = poolsResponse.networkStats.networkHashrate;
				let reward = 0;
				for (let i = 0; i < blocksResponse.length; i++) 
				{
					const currentBlock = blocksResponse[i];
					if (currentBlock.status === "confirmed") 
					{
						reward = currentBlock.reward;
						break;
					}
				}

				if (blocksResponse.length > 0)
				{
					var ancientBlock = blocksResponse[blocksResponse.length - 1];
					var recentBlock = blocksResponse[0];
					var MostRecentBlockTime = recentBlock.created;
					var MostRecentBlockHeight = recentBlock.blockHeight;
					var MostAncientBlockTime = ancientBlock.created;
					var MostAncientBlockHeight = ancientBlock.blockHeight;
					var MostRecentBlockTimeInSeconds = new Date(MostRecentBlockTime).getTime() / 1000;
					var MostAncientBlockTimeInSeconds = new Date(MostAncientBlockTime).getTime() / 1000;
					var blockTime = (MostRecentBlockTimeInSeconds - MostAncientBlockTimeInSeconds) / (MostRecentBlockHeight - MostAncientBlockHeight);
				}
				else
				{
					var blockTime = poolsResponse.blockRefreshInterval;
				}
				var earnPerDay  = reward * (hashAvg/networkHashRate) * (86400/blockTime);
				minerTotalEarn  += earnPerDay;
				workerCount++;
				workerList += "<tr>";
				workerList += "<td>" + workerCount + "</td>";
				if (index.length === 0) 
				{
					workerList += "<td>Unnamed</td>";
				} 
				else 
				{
					workerList += "<td>" + index + "</td>";
				}
				workerList += "<td>" + _formatter(workerHashRate, 3, "H/s") + "</td>";
				workerList += "<td>" + _formatter(hashAvg, 2, "H/s") + "</td>";
				workerList += "<td>" + _formatter(hashAvg2, 2, "H/s") + "</td>";
				workerList += "<td>" + _formatter(hashAvg3, 2, "H/s") + "</td>";
				workerList += "<td>" + _formatter(workerSharesPerSecond, 3, "S/s") + "</td>";
				workerList += "<td>" + _formatter(earnPerDay, 5, " " + coinsymbol) + "</td>";
			});
			if (workerCount > 1)
			{
				workerList += "<tr>";
				workerList += "<td>Total</td>";
				workerList += "<td>"+workerCount+" Worker</td>";
				workerList += "<td>" + _formatter(minerTotalHashRep, 2, "H/s") + "</td>";
				workerList += "<td>" + _formatter(minerTotalHash, 2, "H/s") + "</td>";
				workerList += "<td>" + _formatter(minerTotalHash2, 2, "H/s") + "</td>";
				workerList += "<td>" + _formatter(minerTotalHash3, 2, "H/s") + "</td>";
				workerList += "<td>" + _formatter(minerTotalSharesPerSecond, 3, "S/s") + "</td>";
				workerList += "<td>" + _formatter(minerTotalEarn, 5, " " + coinsymbol) + "</td>";
				workerList += "</tr>";
			}
		} 
		else 
		{
			workerList += '<tr><td colspan="4">None</td></tr>';
		}
		$("#workerCount").text(workerCount);
		$("#workerList").html(workerList);
	}
	catch (error) 
	{
		console.error(error);
	}
}

// DASHBOARD page chart
function loadDashboardChart(walletAddress) {
  return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress + "/performance")
    .done(function(data) {

		labels = [];
        minerHashRate = [];
		
        $.each(data, function(index, value) {
          if (labels.length === 0 || (labels.length + 1) % 2 === 1) {
            var createDate = convertLocalDateToUTCDate(
              new Date(value.created),
              false
            );
            labels.push(createDate.getHours() + ":00");
          } else {
            labels.push("");
          }
          var workerHashRate = 0;
          $.each(value.workers, function(index2, value2) {workerHashRate += value2.hashrate;});
          minerHashRate.push(workerHashRate);
        });
        var data = {labels: labels,series: [minerHashRate]};
        var options = {
          height: "200px",
		  showArea: true,
		  seriesBarDistance: 1,
          axisX: {
            showGrid: false
          },
          axisY: {
            offset: 47,
            labelInterpolationFnc: function(value) {
              return _formatter(value, 1, "");
            }
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 2
          })
        };
        var responsiveOptions = [
          [
          "screen and (max-width: 320px)",
          {
            axisX: {
              labelInterpolationFnc: function(value) {
                return value[0];
              }
            }
          }
        ]
        ];
        Chartist.Line("#chartDashboardHashRate", data, options, responsiveOptions);

    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadDashboardChart)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}


// Generate Coin based sidebar
function loadNavigation() {
  return $.ajax(API + "pools")
    .done(function(data) {
	  var coinLogo = "";
	  var coinName = "";
	  var poolList = "<ul class='navbar-nav '>";
      $.each(data.pools, function(index, value) {
		poolList += "<li class='nav-item'>";
        poolList += "  <a href='#" + value.id.toLowerCase() + "' class='nav-link coin-header" + (currentPool == value.id.toLowerCase() ? " coin-header-active" : "") + "'>"
		poolList += "  <img  src='img/coin/icon/" + value.coin.type.toLowerCase() + ".png' /> " + value.coin.type;
        poolList += "  </a>";
		poolList += "</li>";
		if (currentPool === value.id) {
			coinLogo = "<img style='width:40px' src='img/coin/icon/" + value.coin.type.toLowerCase() + ".png' />";
			coinName = value.coin.name;
			if (typeof coinName === "undefined" || coinName === null) {
				coinName = value.coin.type;
			}
		coinScheme = value.paymentProcessing.payoutScheme; 
		}
      });
      poolList += "</ul>";
	  
      if (poolList.length > 0) {
        $(".coin-list-header").html(poolList);
      }
	  
	var sidebarList = "";
	const sidebarTemplate = $(".sidebar-template").html();
      	sidebarList += sidebarTemplate
		.replace(/{{ coinId }}/g, currentPool)
		.replace(/{{ coinLogo }}/g, coinLogo)
		.replace(/{{ coinName }}/g, coinName)
      	$(".sidebar-wrapper").html(sidebarList);
	$("a.link").each(function() {
	if (localStorage[currentPool + "-walletAddress"] && this.href.indexOf("/dashboard") > 0)
	{
		this.href = "#" + currentPool + "/dashboard?address=" + localStorage[currentPool + "-walletAddress"];
	} 
      });

    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadNavigation)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}

// Dashboard - load wallet stats
function submitSettings() {
  return $.ajax({
    url: API + "pools/" + currentPool + "/miners/" + localStorage[currentPool + "-walletAddress"] + "/settings",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      ipAddress: $("#ipAddress").val(),
      settings: {
        paymentThreshold: $("#minimumPayout").val()
      }
    })
  })
    .done(function (data) {
      $('#updateSuccess').show();
      $("#minimumPayout").val(data.paymentThreshold);

      setTimeout(function () {
        $('#updateSuccess').hide();
      }, 5000);
    })
    .fail(function () {
      $('#updateFailed').show();

      setTimeout(function () {
        $('#updateFailed').hide();
      }, 5000);
    });
}
