
var zackCalen = '<div id="CalendarMain">\
							<div id="title">\
							    <a class="selectBtn month" href="javascript:" onclick="CalendarHandler.CalculateLastMonthDays();"><</a>\
							    <a class="selectBtn selectYear"></a>\
							    <a class="selectBtn selectMonth"></a>\
							    <a class="selectBtn nextMonth" href="javascript:" onClick="CalendarHandler.CalculateNextMonthDays();">></a>\
							    <a class="selectBtn currentDay" href="javascript:" onClick="CalendarHandler.CreateCurrentCalendar(0,0,0);">今天</a>\
							</div>\
							<div id="context">\
								<div class="week">\
									<h3> 一 </h3>\
									<h3> 二 </h3>\
									<h3> 三 </h3>\
									<h3> 四 </h3>\
									<h3> 五 </h3>\
									<h3> 六 </h3>\
									<h3> 日 </h3>\
								</div>\
								<div id="center">\
									<div id="centerMain">\
									    <div id="selectYearDiv"></div>\
										<div id="centerCalendarMain">\
											<div id="Container"></div>\
										</div>\
										<div id="selectMonthDiv"></div>\
									</div>\
								</div>\
							</div>\
						</div>';

var CalendarHandler = {
	currentYear: 0,
	currentMonth: 0,
	isRunning: false,
	initialize: function(e) {
		$calendarItem = this.CreateCalendar(0, 0, 0);
		$("#Container").append($calendarItem);

		$("#context").css("height", $("#CalendarMain").height() -30+ "px");
		$("#center").css("height", $("#context").height() - 30 + "px");
		$("#selectYearDiv").css("height", $("#context").height() - 30 + "px").css("width", $("#context").width() + "px");
		$("#selectMonthDiv").css("height", $("#context").height() - 30 + "px").css("width", $("#context").width() + "px");
		$("#centerCalendarMain").css("height", $("#context").height() - 30 + "px").css("width", $("#context").width() + "px");

		$calendarItem.css("height", $("#context").height() - 30 + "px"); //.css("visibility","hidden");
		$("#Container").css("height", "0px").css("width", "0px").css("margin-left", $("#context").width() / 2 + "px").css("margin-top", ($("#context").height() - 30) / 2 + "px");
		$("#Container").animate({
			width: $("#context").width() + "px",
			height: ($("#context").height() - 30) * 2 + "px",
			marginLeft: "0px",
			marginTop: "0px"
		}, 300, function() {
			$calendarItem.css("visibility", "visible");
		});
		$(".dayItem").css("width", $("#context").width() + "px");
		var itemPaddintTop = $(".dayItem").height() / 6;
		$(".item").css({
			"width": $(".week").width() / 7 + "px",
			"line-height": itemPaddintTop + "px",
			"height": itemPaddintTop + "px"
		});
		$(".currentItem>a").css("margin-left", ($(".item").width() - 25) / 2 + "px").css("margin-top", ($(".item").height() - 25) / 2 + "px");
		$(".week>h3").css("width", $(".week").width() / 7 + "px");
	},			
	IsRuiYear: function(aDate) {
		return (0 == aDate % 4 && (aDate % 100 != 0 || aDate % 400 == 0));
	},
	CalculateWeek: function(y, m, d) {
		if (m == 1) {
			m = 13;
			y--;
		}
		if (m == 2) {
			m = 14;
			y--;
		}
		var week = (d + 2 * m + 3 * (m + 1) / 5 + y + y / 4 - y / 100 + y / 400) % 7 + 1;
		return week;
	},
	CalculateMonthDays: function(m, y) {
		var mDay = 0;
		if (m == 0 || m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12) {
			mDay = 31;
		} else {
			if (m == 2) {
				//判断是否为芮年
				var isRn = this.IsRuiYear(y);
				if (isRn == true) {
					mDay = 29;
				} else {
					mDay = 28;
				}
			} else {
				mDay = 30;
			}
		}
		return mDay;
	},
	CreateCalendar: function(y, m, d) {
		$dayItem = $("<div class=\"dayItem\"></div>");
		//获取当前月份的天数
		var nowDate = new Date();
		if(y==nowDate.getFullYear()&&m==nowDate.getMonth()+1||(y==0&&m==0))
		$(".currentDay").hide();
		var nowYear = y == 0 ? nowDate.getFullYear() : y;
		this.currentYear = nowYear;
		var nowMonth = m == 0 ? nowDate.getMonth() + 1 : m;
		this.currentMonth = nowMonth;
		var nowDay = d == 0 ? nowDate.getDate() : d;
		$(".selectYear").html(nowYear + "年");
		$(".selectMonth").html(nowMonth + "月");
		var nowDaysNub = this.CalculateMonthDays(nowMonth, nowYear);
		//获取当月第一天是星期几
		//var weekDate = new Date(nowYear+"-"+nowMonth+"-"+1);
		//alert(ss.getDay());
		var nowWeek = parseInt(this.CalculateWeek(nowYear, nowMonth, 1));
		//var nowWeek=weekDate.getDay();
		//获取上个月的天数
		var lastMonthDaysNub = this.CalculateMonthDays((nowMonth - 1), nowYear);

		if (nowWeek != 0) {
			//生成上月剩下的日期
			for (var i = (lastMonthDaysNub - (nowWeek - 1)); i < lastMonthDaysNub; i++) {
				$dayItem.append("<div class=\"item lastItem\"><a>" + (i + 1) + "</a></div>");
			}
		}

		//生成当月的日期
		for (var i = 0; i < nowDaysNub; i++) {
			if (i == (nowDay - 1)) $dayItem.append("<div class=\"item currentItem\"><a>" + (i + 1) + "</a></div>");
			else $dayItem.append("<div class=\"item\"><a>" + (i + 1) + "</a></div>");
		}

		//获取总共已经生成的天数
		var hasCreateDaysNub = nowWeek + nowDaysNub;
		//如果小于42，往下个月推算
		if (hasCreateDaysNub < 42) {
			for (var i = 0; i <= (42 - hasCreateDaysNub); i++) {
				$dayItem.append("<div class=\"item lastItem\"><a>" + (i + 1) + "</a></div>");
			}
		}

		return $dayItem;
	},
	CSS: function() {
		var itemPaddintTop = $(".dayItem").height() / 6;
		$(".item").css({
			"width": $(".week").width() / 7 + "px",
			"line-height": itemPaddintTop + "px",
			"height": itemPaddintTop + "px"
		});
		$(".currentItem>a").css("margin-left", ($(".item").width() - 25) / 2 + "px").css("margin-top", ($(".item").height() - 25) / 2 + "px");
	},
	CalculateNextMonthDays: function() {
		if (this.isRunning == false) {
			$(".currentDay").show();
			var m = this.currentMonth == 12 ? 1 : this.currentMonth + 1;
			var y = this.currentMonth == 12 ? (this.currentYear + 1) : this.currentYear;
			var d = 0;
			var nowDate = new Date();
			if (y == nowDate.getFullYear() && m == nowDate.getMonth() + 1) d = nowDate.getDate();
			else d = 1;
			$calendarItem = this.CreateCalendar(y, m, d);
			$("#Container").append($calendarItem);

			this.CSS();
			this.isRunning = true;
			$($("#Container").find(".dayItem")[0]).animate({
				height: "0px"
			}, 300, function() {
				$(this).remove();
				CalendarHandler.isRunning = false;
			});
		}
	},
	CalculateLastMonthDays: function() {
		if (this.isRunning == false) {
			$(".currentDay").show();
			var nowDate = new Date();					
			var m = this.currentMonth == 1 ? 12 : this.currentMonth - 1;
			var y = this.currentMonth == 1 ? (this.currentYear - 1) : this.currentYear;
			var d = 0;
			
			if (y == nowDate.getFullYear() && m == nowDate.getMonth() + 1) d = nowDate.getDate();
			else d = 1;
			$calendarItem = this.CreateCalendar(y, m, d);
			$("#Container").append($calendarItem);
			var itemPaddintTop = $(".dayItem").height() / 6;
			this.CSS();
			this.isRunning = true;
			$($("#Container").find(".dayItem")[0]).animate({
				height: "0px"
			}, 300, function() {
				$(this).remove();
				CalendarHandler.isRunning = false;
			});
		}
	},
	CreateCurrentCalendar: function() {
		if (this.isRunning == false) {
			$(".currentDay").hide();
			$calendarItem = this.CreateCalendar(0, 0, 0);
			$("#Container").append($calendarItem);
			this.isRunning = true;
			$($("#Container").find(".dayItem")[0]).animate({
				height: "0px"
			}, 300, function() {
				$(this).remove();
				CalendarHandler.isRunning = false;
			});
			this.CSS();
			$("#centerMain").animate({
				marginLeft: -$("#center").width() + "px"
			}, 500);
		}
	},	
}


