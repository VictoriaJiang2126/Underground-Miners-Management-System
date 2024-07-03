import { Storage } from '../../assets/js/tools.js'
import { reactive, ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

let viewer = null

export default {
	name: 'trackerControl',
  setup() {
     const userNameValue = ref('')
     const chooseDateValue = ref('2023-04-14')
     const workersDataLastRound = reactive({
       data: []
     })
     const workerData = reactive({
       data: [] // 左上角panel的信息数组
     })
     // const upPos = reactive({
     //   data: []  // 最后用于生产czml的信息数组
     // })
     // const upPos = ref([])


     const pathValue = reactive({
       data: []  // 鼠标pick一个工人的头像后查询当天的postion信息，存放在path这个变量中
     })
     const cartesianPositions = reactive({
       data: []
     })

     let entity;
     let inRun = ref(false)  //没有使用workerMove之前是false的，用一次后变成true。
     let upEntity, downEntity;
     let upInterval = null;
     let downInterval = null;
     let globalServerIP = "/api";
     let globalPickedEntity = null;
     let globalselectedDate = '2023-04-14';
     let dig = false;
     let ifaddGlb = false;


    //矿区开挖函数 详见TerrainClipPlan.js
    const digMountain = () => {
      if (dig) {
          return;
      }
      dig = true;
      let terrainClipPlan = new TerrainClipPlan(viewer, {
          height: 300,
          splitNum: 1000,
          bottomImg: './libs/地.jpg',//底面纹理
          wallImg: './libs/壁.jpg'//四周纹理
      })
      terrainClipPlan.updateData(cartesianPositions.data)



      //红色
      var redPolygon = viewer.entities.add({
          id: "face1",
          name: "Red polygon on surface",
          polygon: {
              hierarchy: Cesium.Cartesian3.fromDegreesArray([
                  109.170560, 32.749538, //1
                  109.41299267468023, 32.73002522262707, //2
                  109.37418177870398, 32.53646243663744, //3
                  109.11802133540426, 32.515854013282166  //4

              ]),
              height: 500.0,
              material: Cesium.Color.RED.withAlpha(0.2),
          },
      });
      // 109.170560, 32.749538, //1
      // 109.41299267468023, 32.73002522262707 //2
      // 109.37418177870398, 32.53646243663744, //3
      // 109.11802133540426, 32.515854013282166  //4
      // 109.67697241300918,32.70543437981059  //5
      // 109.59971416210827,32.52901634174406  //6
      // 109.05826317295602,32.28131888642045  //7
      // 109.23846419939744,32.285882840688615  //8
      // 109.49754327996396,32.28602709951293  //9

      //黄色
      var redPolygon = viewer.entities.add({
          id: "face2",
          name: "Yellow polygon on surface",
          polygon: {
              hierarchy: Cesium.Cartesian3.fromDegreesArray([
                  109.41299267468023, 32.73002522262707, //2
                  109.67697241300918, 32.70543437981059, //5
                  109.59971416210827, 32.52901634174406, //6
                  109.37418177870398, 32.53646243663744  //3

              ]),
              height: 500.0,
              material: Cesium.Color.YELLOW.withAlpha(0.2),
          },
      });
      //绿色
      var redPolygon = viewer.entities.add({
          id: "face3",
          name: "Green polygon on surface",
          polygon: {
              hierarchy: Cesium.Cartesian3.fromDegreesArray([
                  109.11802133540426, 32.515854013282166, //4
                  109.37418177870398, 32.53646243663744, //3
                  109.23846419939744, 32.285882840688615, //8
                  109.05826317295602, 32.28131888642045  //7

              ]),
              height: 500.0,
              material: Cesium.Color.GREEN.withAlpha(0.2),
          },
      });
      //蓝色
      var redPolygon = viewer.entities.add({
          id: "face4",
          name: "Blue polygon on surface",
          polygon: {
              hierarchy: Cesium.Cartesian3.fromDegreesArray([
                  109.37418177870398, 32.53646243663744, //3
                  109.59971416210827, 32.52901634174406, //6
                  109.49754327996396, 32.28602709951293, //9
                  109.23846419939744, 32.285882840688615  //8

              ]),
              height: 500.0,
              material: Cesium.Color.BLUE.withAlpha(0.2),
          },
      });
    }

    //从数据库读取工人信息 添加至系统
    const initWorkers = (selectedDate) => {
        // console.log(selectedDate);
        let url = globalServerIP + "/readWorkers";
        let data = {
            date: selectedDate
        };
        //数据请求
        axios.post(url, data, { responseType: 'string' })
            .then( (res) => {
                if (res.status == 200) {
                    if (workersDataLastRound.data.length == 0) {
                        let workersData = res.data.data;
                        for (let i = 0; i < workersData.length; i++) {
                            addWorker(workersData[i]);
                        }
                        workersDataLastRound.data = workersData;
                    }
                    else{
                        for(let i = 0; i < workersDataLastRound.data.length; i++){
                            let entity = viewer.entities.getById(workersDataLastRound.data[i].id);
                            viewer.entities.remove(entity);
                        }
                        let workersData = res.data.data;
                        for (let i = 0; i < workersData.length; i++) {
                            addWorker(workersData[i]);
                        }
                        workersDataLastRound.data = workersData;
                    }

                }
            })
            .catch(function (err) {
                alert(err);
            })
    }
    //这段代码向服务器发出HTTP POST请求，接收字符串响应，并将返回的数据添加到一个本地变量workdata中。如果请求成功，则使用返回的数据调用addWorker()函数。如果请求失败，则显示一个带有错误信息的警报消息。

    const searchDate = () => {
        // 获取搜索框元素
        var dropdown = document.getElementById("date-dropdown-container");

        // 将搜索框添加到Cesium Viewer的overlay中
        var overlay = viewer.container.appendChild(dropdown);
        overlay.style.visibility = "visible";



        var list = document.getElementById('date-dropdownlist');
        var button = document.getElementById('confirm-button');




        button.addEventListener("click",  () => {
            var indexs = list.selectedIndex;  //选中项的索引
            // console.log(list.options[indexs].value);
            globalselectedDate = list.options[indexs].value;
            initWorkers(list.options[indexs].value);

        });

    }

    const phoneAlert = () => {
        // 获取搜索框元素
        var dropdown = document.getElementById("phone-dropdown-container");

        // 将搜索框添加到Cesium Viewer的overlay中
        var overlay = viewer.container.appendChild(dropdown);
        overlay.style.visibility = "visible";


        var list = document.getElementById('phone-dropdownlist');
        var button = document.getElementById('call-button');



        button.addEventListener("click",  () => {
            var indexs = list.selectedIndex;  //选中项的索引
            console.log(list.options[indexs].value);
            var num = list.options[indexs].value;
            if (num == 1){
                tel();
            }
            function tel() {
                if (confirm("Are you sure to make a Phonecall Alert to the the Staff in Section 1?")) {
                    window.location.href='tel:13609918569'
                } else {
                    console.log("Cancel the Phonecall.");
                }
            }


        });

    }

    const searchMiner = () => {
        // 获取搜索框元素
        var searchBox = document.getElementById("search-box");

        // 将搜索框添加到Cesium Viewer的overlay中
        var overlay = viewer.container.appendChild(searchBox);
        overlay.style.visibility = "visible";

        var searchButton = searchBox.querySelector("button");
        var searchInput = searchBox.querySelector("input");

        searchButton.addEventListener("click", function () {
            searchWorker(searchInput.value);
        });

        searchInput.addEventListener("keydown", function (e) {
            if (e.keyCode === 13) {
                searchWorker(searchInput.value);
            }
        });
        // // console.log(searchInput.value);
        // function searchWorker(input) {
        //     let url = globalServerIP + "/searchByName";
        //     let data = {
        //     name: input,
        //     date:globalselectedDate
        // };

        // //数据请求
        // axios.post(url, data, { responseType: 'string' })
        //     .then(function (res) {
        //         if (res.status == 200) {
        //             let workersData = res.data;
        //             // console.log(workersData[0].pos10);
        //             let positions = workersData[0].pos10.split(",");
        //             viewer.camera.flyTo({
        //                 destination: Cesium.Cartesian3.fromDegrees(positions[0], positions[1], 6000)
        //             });
        //         }

        //     })
        //     .catch(function (err) {
        //         alert("Miner does not exist,please try again.");
        //     })
        // }
    }

    const searchWorker = (input) => {
        let url = globalServerIP + "/searchByName";
        let data = {
          name: input,
          date:globalselectedDate,
        }

        axios.post(url, data, { responseType: 'string' }).then(res => {
          if (res.status == 200) {
              let workersData = res.data.data;
              let positions = workersData[0].pos10.split(",");
              viewer.camera.flyTo({
                  destination: Cesium.Cartesian3.fromDegrees(positions[0], positions[1], 6000)
              });
          }
        }).catch(err => {
          alert("Miner does not exist,please try again.");
        })
    }



    //添加工人图标与名称
    const addWorker = (dataNow) => {
        //dataNow就是当前的workerData[i]
        let positions = dataNow.pos10.split(",");
        let iconUrl = "./libs/data/工人.png"
        viewer.entities.add({
            id: dataNow.id,
            name: dataNow.name,
            age: dataNow.age,
            email: dataNow.email,
            gender: dataNow.gender,
            level: dataNow.level,
            mark: dataNow.mark,
            phone: dataNow.phone,
            section_id: dataNow.section_id,
            position: Cesium.Cartesian3.fromDegrees(positions[0], positions[1], 2000),
            recordPosition: dataNow.position,
            label: { //文字标签
                text: dataNow.name,
                font: '500 16px Helvetica',// 15pt monospace
                scale: 1,
                style: Cesium.LabelStyle.FILL,
                fillColor: Cesium.Color.YELLOW,
                pixelOffset: new Cesium.Cartesian2(0, -100), //偏移量
                showBackground: true,
                backgroundColor: new Cesium.Color(0, 0, 0, 0.5)
            },
            billboard: {//图标
                image: iconUrl,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 0.5, 1.5e7, 0.3),
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                width: 150,
                height: 150,
                // imageSubRegion:{x:134,y:0,width:134,height:136}
            },
        });
    }

    //左键点击监听函数 监听鼠标是否左击工人图标或名称 若是则显示信息
    const addListenr = () => {
        let handlerClick = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handlerClick.setInputAction((e) => {
            let picked = viewer.scene.pick(e.position);
            if (picked) {
                let pickedEntity = Cesium.defaultValue(picked.id, picked.primitive.id);

                if (pickedEntity instanceof Cesium.Entity && pickedEntity.id != undefined && pickedEntity.id != "main" && pickedEntity.id != "face1" && pickedEntity.id != "face2" && pickedEntity.id != "face3" && pickedEntity.id != "face4") {//点
                    globalPickedEntity = pickedEntity;
                    viewer.trackedEntity = undefined;
                    addInfo(pickedEntity);//显示工人信息
                    //createPath();
                    loadPathData(pickedEntity)
                }
                else {
                    globalPickedEntity = null;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //工人信息添加函数
    const addInfo = (pickedEntity) => {
        var content = '<table class="cesium-infoBox-defaultTable"><tbody>'
            + '<tr><th>id</th><td >'
            + pickedEntity.id
            + '</td></tr>'
            + '<tr><th>name</th><td >'
            + pickedEntity.name
            + '</td></tr>'
            + '<tr><th>age</th><td >'
            + pickedEntity.age
            + '</td></tr>'
            + '<tr><th>gender</th><td >'
            + pickedEntity.gender
            + '</td></tr>'
            + '<tr><th>phone number</th><td >'
            + pickedEntity.phone
            + '</td></tr>'
            // + '<tr><th>birthday</th><td >'
            // + pickedEntity.birthday
            // + '</td></tr>'
            + '<tr><th>level</th><td >'
            + pickedEntity.level
            + '</td></tr>'
            + '<tr><th>email</th><td >'
            + pickedEntity.email
            + '</td></tr>'
            + '<tr><th>section_id</th><td >'
            + pickedEntity.section_id
            + '</td></tr>'
            + '<tr><th>mark</th><td >'
            + pickedEntity.mark
            + '</td></tr>'
            + '</tbody></table>';
        var selectedEntity = new Cesium.Entity();
        selectedEntity.name = "worker's information";
        selectedEntity.description = content;
        viewer.selectedEntity = selectedEntity;

    }

    const loadPathData = (pickedEntity) => {
        let url = globalServerIP + "/loadPathPositions";
        let data = {
            id: pickedEntity.id,
            date:globalselectedDate
        };
        //数据请求
        axios.post(url, data, { responseType: 'string' })
        .then(function (res) {
            //console.log('进入get请求了');
            if (res.status == 200) {
              // console.log(res.data.data)
                pathValue.data = res.data.data;
            }
        })
        .catch(function (err) {
            alert(err);
        });
    }

    //笛卡尔坐标下距离计算函数
    const computeDistance = (a, b) => {
        let distance = Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2) + Math.pow((a.z - b.z), 2))
        return distance;
    }

    //工人移动函数 ：与track直接相关
    const workersMove = () => {
      let upPos = []
      // let path = pathValue.data
        //生成路径
        for (let i = 0; i < pathValue.data.length; i++) {
            upPos.push(pathValue.data[i].time10);
            let pos10S = pathValue.data[i].pos10.split(",");
            upPos.push(Number(pos10S[0]));
            upPos.push(Number(pos10S[1]));
            upPos.push(500);//高度

            upPos.push(pathValue.data[i].time11);
            let pos11S = pathValue.data[i].pos11.split(",");
            upPos.push(Number(pos11S[0]));
            upPos.push(Number(pos11S[1]));
            upPos.push(500);//高度

            upPos.push(pathValue.data[i].time12);
            let pos12S = pathValue.data[i].pos12.split(",");
            upPos.push(Number(pos12S[0]));
            upPos.push(Number(pos12S[1]));
            upPos.push(500);//高度

            upPos.push(pathValue.data[i].time15);
            let pos15S = pathValue.data[i].pos15.split(",");
            upPos.push(Number(pos15S[0]));
            upPos.push(Number(pos15S[1]));
            upPos.push(500);//高度

            upPos.push(pathValue.data[i].time16);
            let pos16S = pathValue.data[i].pos16.split(",");
            upPos.push(Number(pos16S[0]));
            upPos.push(Number(pos16S[1]));
            upPos.push(500);//高度

            upPos.push(pathValue.data[i].time17);
            let pos17S = pathValue.data[i].pos17.split(",");
            upPos.push(Number(pos17S[0]));
            upPos.push(Number(pos17S[1]));
            upPos.push(500);//高度

            workerData.data.push({
                position: pathValue.data[i].pos10,
                time: pathValue.data[i].time10,
                status: "WORKING"
            });
            workerData.data.push({
                position: pathValue.data[i].pos11,
                time: pathValue.data[i].time11,
                status: "WORKING"
            });
            workerData.data.push({
                position: pathValue.data[i].pos12,
                time: pathValue.data[i].time12,
                status: "WORKING"
            });
            workerData.data.push({
                position: pathValue.data[i].pos15,
                time: pathValue.data[i].time15,
                status: "WORKING"
            });
            workerData.data.push({
                position: pathValue.data[i].pos16,
                time: pathValue.data[i].time16,
                status: "WORKING"
            });
            workerData.data.push({
                position: pathValue.data[i].pos17,
                time: pathValue.data[i].time17,
                status: "WORKING"
            });

        }



        //未点击工人就点击轨迹 提示并返回
        if (globalPickedEntity === null) {
            alert("Please select a miner first!")
            return;
        }

        //若在运行中 终止运行 清楚路径 清楚模型
        if (inRun.value) {
            viewer.dataSources.removeAll();
            clearInterval(upInterval);
            viewer.trackedEntity = undefined;
            inRun.value = false;
            return;
        }
        inRun.value = true;


        let intervalTime = globalselectedDate+"T10:00:00Z/"+globalselectedDate+"T18:00:40Z";
        let currentTime = globalselectedDate+"T10:00:00Z";
        //创建czml轨迹
        var czml = [
            {
                "id": "document",
                "name": "CZML Path",
                "version": "1.0",
                "clock": {
                    // "interval": "2023-03-27T13:00:00Z/2023-03-27T13:01:40Z",//时间区间 ！！！！
                    // "currentTime": "2023-03-27T13:00:00Z",


                    // "interval": "2023-04-10T10:00:00Z/2023-04-10T17:00:00Z",//时间区间 ！！！！
                    // "currentTime": "2023-04-10T10:00:00Z",
                    // "multiplier": 5,//行走速度
                    // "range": "LOOP_STOP",
                    // "step": "SYSTEM_CLOCK_MULTIPLIER"

                    "interval": intervalTime,
                    "currentTime": currentTime,
                    "multiplier": 1,
                    "step": "SYSTEM_CLOCK_MULTIPLIER",
                    "range": "LOOP_STOP"
                },
            },
            {
                "id": "workerMove",
                "name": "worker path",
                "description": "the path of woker",
                "availability": intervalTime,//!!!
                "path": { //行走路径
                    "material": {
                        "polylineOutline": {
                            "color": {
                                "rgba": [255, 0, 255, 127],
                            },
                            "outlineColor": {
                                "rgba": [255, 0, 255, 127],
                            },
                            "outlineWidth": 3,
                        },
                    },
                    "width": 5,
                    "leadTime": 100,
                    "trailTime": 25200,
                    "resolution": 100,
                },
                "model": { //人的模型
                    // "gltf": "./libs/data/Cesium_Man.glb",
                    "gltf": "./libs/data/worker.glb",
                    "scale": 10,
                    "height": 200,
                    "minimumPixelSize": 256,
                },
                'position': {
                    //"epoch": "2023-03-27T13:00:00Z", //轨迹开始时间？
                    "epoch": currentTime, //轨迹开始时间？
                    'cartographicDegrees': upPos, //三个值 经度纬度和高度
                },
            },
        ];



        var entity111;
        //添加轨迹
        viewer.dataSources.add(Cesium.CzmlDataSource.load(czml)).then( (dataSource) => {

            upInterval = setInterval( () => {
                entity111 = dataSource.entities.getById("workerMove");



                // console.log(upPos);
                // console.log(typeof (upPos[0]));
                // console.log(typeof (upPos[1]));
                // console.log(typeof (upPos[2]));
                // 设置模型可以随路径方向转向

                entity111.orientation = new Cesium.VelocityOrientationProperty(entity111.position);
                entity111.model.alignedAxis = new Cesium.VelocityVectorProperty(entity111.position, true);
                // upEntity= entity;
                viewer.trackedEntity = entity111;
                let catesianArry = entity111.position._property._interpolationResult;
                // console.log("catesianArry", catesianArry)
                var cartographic = Cesium.Cartographic.fromCartesian(new Cesium.Cartesian3(catesianArry[0], catesianArry[1], catesianArry[2]));
                let longtitude = Cesium.Math.toDegrees(cartographic.longitude)
                // console.log('longtitude:  ' + typeof (longtitude));
                let latitude = Cesium.Math.toDegrees(cartographic.latitude)
                // console.log('latitude:  ' + typeof (latitude));
                let height = Cesium.Math.toDegrees(cartographic.height)

                let julianTime = viewer.clock.currentTime;

                let name = globalPickedEntity.name;
                let labelName = document.getElementById("workerName");
                labelName.innerHTML = name;
                let labelPos = document.getElementById("position");
                labelPos.innerHTML = longtitude.toFixed(5) + " " + latitude.toFixed(5);
                let labelTime = document.getElementById("timeNow");
                let timeString = julianTime.toString();
                let index = timeString.indexOf(".");
                let timeStringNow = timeString.slice(0, index)
                labelTime.innerHTML = timeStringNow;
                let labelStatus = document.getElementById("status");

                // console.log(workerData.data)
                let workerData111 = JSON.parse(JSON.stringify(workerData))
                let result = workerData111.data
                // console.log(result)

                for (let i = 0; i < result.length - 1; i++) {
                    if (timeStringNow > result[i].time && timeStringNow < result[i + 1].time) {
                        labelStatus.innerHTML = result[i].status;
                        break;
                    }
                }
            }, 1000);

        });

    }


    //84经纬度转笛卡尔坐标
    const transformWGS84ToCartesian = (position, alt) => {
        if (viewer) {
            return position
                ? Cesium.Cartesian3.fromDegrees(
                    position.lng || position.lon,
                    position.lat,
                    position.alt = alt || position.alt,
                    Cesium.Ellipsoid.WGS84
                )
                : Cesium.Cartesian3.ZERO
        }
    }
    //笛卡尔转84经纬度
    const transformCartesianToWGS84 = (cartesian) => {
        if (viewer && cartesian) {
            var ellipsoid = Cesium.Ellipsoid.WGS84
            var cartographic = ellipsoid.cartesianToCartographic(cartesian)
            return {
                lng: Cesium.Math.toDegrees(cartographic.longitude),
                lat: Cesium.Math.toDegrees(cartographic.latitude),
                alt: cartographic.height
            }
        }
    }

    const show3DCoordinates = () => {
    	//地图底部工具栏显示地图坐标信息
    	var coordinatesDiv = document.getElementById("map_coordinates");
    	if (coordinatesDiv) {
    		coordinatesDiv.style.display = "block";
    	} else {
    		coordinatesDiv = document.createElement("div");
    		coordinatesDiv.id = "map_coordinates";
    		coordinatesDiv.style.zIndex = "50";
    		coordinatesDiv.style.bottom = "50px";
    		coordinatesDiv.style.height = "29px";
    		coordinatesDiv.style.position = "absolute";
    		coordinatesDiv.style.overflow = "hidden";
    		coordinatesDiv.style.textAlign = "center";
    		coordinatesDiv.style.left = "200px";
    		coordinatesDiv.style.lineHeight = "29px";
    		coordinatesDiv.innerHTML =
    			"<span id='cd_label' style='font-size:15px;text-align:center;font-family:微软雅黑;color:#edffff;'>暂无坐标信息</span>";
    		$(".cesium-viewer").append(coordinatesDiv);
    		let handlers = new Cesium.ScreenSpaceEventHandler(viewer.scene._imageryLayerCollection);
    		// 获取相机的海拔高度作为视角高度/km
    		handlers.setInputAction(function(event) {
    			//获取相机射线
    			var ray = viewer.scene.camera.getPickRay(event.endPosition);
    			//根据射线和场景求出在球面中的笛卡尔坐标
    			var position1 = viewer.scene.globe.pick(ray, viewer.scene);
    			//获取该浏览器坐标的顶部数据
    			var feature = viewer.scene.pick(event.endPosition);
    			var lon = 0;
    			var lat = 0;
    			if (feature == undefined && position1) {
    				var cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position1);
    				lon = Cesium.Math.toDegrees(cartographic1.longitude);
    				lat = Cesium.Math.toDegrees(cartographic1.latitude);
    			} else {
    				let cartesian = viewer.scene.pickPosition(event.endPosition);
    				if (Cesium.defined(cartesian)) {
    					//如果对象已定义，将度转为经纬度
    					let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    					lon = Cesium.Math.toDegrees(cartographic.longitude);
    					lat = Cesium.Math.toDegrees(cartographic.latitude);
    				}
    			}
    			// 获取相机的高度
    			let cameraHeight = Math.ceil(viewer.camera.positionCartographic.height);
    			coordinatesDiv.innerHTML =
    				"<span id='cd_label' style='font-size:15px;text-align:center;font-family:微软雅黑;color:#edffff;'>视角高度:" +
    				cameraHeight + "米&nbsp;&nbsp;&nbsp;&nbsp;经度：" + lon.toFixed(6) + "&nbsp;&nbsp;纬度:" + lat
    				.toFixed(6) + "</span>";
    		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    	}
    }



    return {
      searchWorker,
      userNameValue,
      chooseDateValue,
      workersDataLastRound,
      workerData,
      // upPos,
      pathValue,
      cartesianPositions,
      digMountain,
      initWorkers,
      phoneAlert,
      searchDate,
      searchMiner,
      addWorker,
      addListenr,
      addInfo,
      loadPathData,
      entity,
      inRun,
      upEntity,
      downEntity,
      upInterval,
      downInterval,
      globalPickedEntity,
      globalselectedDate,
      dig,
      ifaddGlb,
      workersMove,
      transformWGS84ToCartesian,
      transformCartesianToWGS84,
      show3DCoordinates,
    }
  },
  created() {


  },
  mounted() {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YWM0MTdhYS0zZDU1LTQxMTctOTgyYS02OTQ4ZDI0MzBjZDMiLCJpZCI6NTY1OTIsImlhdCI6MTY0NjkxNTYxN30.665zh5Kt3LK-EDOO7rOeGjypVfr4sTYh8BhIt3yGdik';
    viewer = new Cesium.Viewer('cesiumContainer', {
      geocoder: true, //搜索框
      homeButton: true, //home按钮
      sceneModePicker: true, //3d/2d 模式切换按钮
      baseLayerPicker: false, //图层选择按钮
      navigationHelpButton: false, //右上角的帮助按钮
      animation: true, //左下角的动画控件的显示
      shouldAnimate: false, //控制模型动画 //??
      timeline: true, //底部的时间轴
      fullscreenButton: true, //右下角的全屏按钮
      selectionIndicator: true, //选择指示器
      infoBox: true, //信息面板
    });

    viewer.shouldAnimate = true;
    viewer._cesiumWidget._creditContainer.style.display = "none";//显示帧率
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    viewer.terrainProvider = Cesium.createWorldTerrain();//注释掉即不加载地形 会提升加载速度  但会影响高程测量
    viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;//允许相机进入地下
    viewer.scene.postProcessStages.fxaa.enabled = true;//抗锯齿
    //viewer.scene.globe.depthTestAgainstTerrain=false;
    let upEntity, downEntity;
    let upInterval = null;
    let downInterval = null;
    viewer.clock.shouldAnimate = true;
    let globalServerIP = "http://localhost:80";
    // let globalPickedEntity = null;
    let globalselectedDate = '2023-04-14';
    let dig = false;
    let ifaddGlb = false;
    //矿区角点坐标 经度纬度高度
    let edge = [
        {
            lon: 109.170560, lat: 32.749538, alt: 800
        },
        {
            lon: 109.058835, lat: 32.288027, alt: 800
        },
        {
            lon: 109.497484, lat: 32.290906, alt: 800
        },
        {
            lon: 109.672027, lat: 32.705820, alt: 800
        }
    ]
    //初始飞行到矿山位置
    viewer.camera.flyTo({
        //destination: Cesium.Cartesian3.fromDegrees(108.842121, 34.015849, 5000),
        destination: Cesium.Cartesian3.fromDegrees(109.457025, 32.505820, 5000),
        duration: 1,//duration-相机飞行的时间,秒为单位,值越小,速度越快.
    });
    // let cartesianPositions = [];
    //经纬度转笛卡尔坐标系
    for (let i = 0; i < edge.length; i++) {
      let temp = this.transformWGS84ToCartesian(edge[i]);
      this.cartesianPositions.data.push(temp);
    }

    this.digMountain()

    //创建鼠标双击事件处理程序
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction( (click) => {
        // 获取单击位置的经纬度
        var cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var longitude = Cesium.Math.toDegrees(cartographic.longitude);
        var latitude = Cesium.Math.toDegrees(cartographic.latitude);
        // 在控制台输出经纬度
        // console.log("Longitude: " + longitude + ", Latitude: " + latitude);
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    this.initWorkers("2023-04-14");//加载工人

    this.searchDate();

    this.phoneAlert();

    this.searchMiner();

    this.addListenr();

    //左下角实时显示鼠标所处位置经纬度坐标
    this.show3DCoordinates();

  },
}
