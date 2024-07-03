<template>
  <div class="trackerControl">
    <div id="search-box">
      <label for="search-box">Enter the Name:</label>
      <input type="text" placeholder="e.g. Ann Smith">
      <button>Confirm</button>
    </div>



    <div id="date-dropdown-container">
      <label for="date-dropdownlist">Choose a date:</label>
      <select id="date-dropdownlist">
        <option value="2023-04-14">Friday, April 14, 2023</option>
        <option value="2023-04-13">Thursday, April 13, 2023</option>
        <option value="2023-04-12">Wednesday, April 12, 2023</option>
        <option value="2023-04-11">Tuesday, April 11, 2023</option>
        <option value="2023-04-10">Monday,April 10, 2023</option>
        <option value="2023-04-07">Friday, April 07, 2023</option>
        <option value="2023-04-06">Thursday, April 06, 2023</option>
        <option value="2023-04-05">Wednesday, April 05, 2023</option>
        <option value="2023-04-04">Tuesday, April 04, 2023</option>
        <option value="2023-04-03">Monday, April 03, 2023</option>
        <option value="2023-03-31">Friday, March 31, 2023</option>
        <option value="2023-03-30">Thursday, March 30, 2023</option>
        <option value="2023-03-29">Wednesday, March 29, 2023</option>
        <option value="2023-03-28">Tuesday, March 28, 2023</option>
        <option value="2023-03-27">Monday, March 27, 2023</option>
        <option value="2023-03-24">Friday, March 24, 2023</option>
        <option value="2023-03-23">Thursday, March 23, 2023</option>
        <option value="2023-03-22">Wednesday, March 22, 2023</option>
        <option value="2023-03-21">Tuesday, March 21, 2023</option>
        <option value="2023-03-20">Monday, March 20, 2023</option>
      </select>
      <button id="confirm-button">Confirm</button>
    </div>

    <div id="phone-dropdown-container" style="left: 3%; top: 60%; margin-left: 10px; z-index: 60;">
      <label for="phone-dropdownlist">PHONE ALERT:</label>
      <select id="phone-dropdownlist">
        <option value="1">Section 1: Preparation Mining Face Staff</option>
        <option value="2">Section 2: Drift Working Area Staff</option>
        <option value="3">Section 3: Mining Support Area Staff</option>
        <option value="4">Section 4: Main Mining Face Staff</option>
      </select>
      <button id="call-button">Call</button>
    </div>

    <div id="cesiumContainer"></div>



    <button @click="workersMove"
      style="z-index: 6666 !important;
             left:10%; position: absolute;
             bottom: 15%; text-align: center;
             font-weight:bold;
            background-color: #00186a;
            color: #fff;
            border: none;
            border-radius: 5px;
            padding: 10px 50px;
            margin-left: 8px;
            cursor: pointer;
             color: aliceblue;">Tracking</button>






    <div class="data">
      <div class="data-content" style="z-index: 6 !important;">
        <div class="con-left fl" style="z-index: 6 !important;">
          <div class="left-top" style="z-index: 6 !important;">
            <div class="info" style="z-index: 6 !important; top:0px">
              <div class="info-title" style="z-index: 6 !important;">Tracking Panel</div>
              <img src="libs/img/bj-1.png" alt="" class="bj-1">
              <img src="libs/img/bj-2.png" alt="" class="bj-2">
              <img src="libs/img/bj-3.png" alt="" class="bj-3">
              <img src="libs/img/bj-4.png" alt="" class="bj-4">
              <div class="info-main">
                <div class="info-1">
                  <div class="info-img fl">
                    <img src="libs/img/工人图标.png" alt="">
                  </div>
                  <div class="info-text fl">
                    <p>Name</p>
                    <p id="workerName"></p>
                  </div>
                </div>
                <div class="info-2">
                  <div class="info-img fl">
                    <img src="libs/img/info-img-2.png" alt="">
                  </div>
                  <div class="info-text fl">
                    <p>Location</p>
                    <p id="position"></p>
                  </div>
                </div>
                <div class="info-3">
                  <div class="info-img fl">
                    <img src="libs/img/info-img-3.png" alt="">
                  </div>
                  <div class="info-text fl">
                    <p>Time</p>
                    <p id="timeNow"></p>
                  </div>
                </div>
                <div class="info-4">
                  <div class="info-img fl">
                    <img src="libs/img/info-img-4.png" alt="">
                  </div>
                  <div class="info-text fl">
                    <p>Status</p>
                    <p id="status"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style lang="scss" src="./style.scss" scope></style>
