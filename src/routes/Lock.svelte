<script>
export let unlocked = false;
const toggleLock = function() {
//   document.querySelector('.lock').classList.toggle('unlocked');
	unlocked = !unlocked;
}
</script>

<button id="btn-lock" title="Unlock to make your own change; Lock to save changed content temporarily" on:click={toggleLock}>
  <div id="container-lock">
  <span class="lock {unlocked ? 'unlocked' : ''}"></span>
		
</div>

</button>



<style>
/* https://codepen.io/cxumol/pen/jOwgGjK */
/* :::::::::::::: Presentation css */
#btn-lock{
/*   border: 0.1em solid #ddd; */
  border-radius: 50%;
  background-color: Transparent;
  min-height : 80px;
  min-width : 80px;
/*   display: flex; */
  position: fixed;
  bottom: 10px;
  right: 10px;
	padding:0;
}
#container-lock {
/*   box-sizing: border-box; */
  --locked-color: #5fadbf;
  --unlocked-color: #ff5153;
}
#container-lock {
  display: flex;
  align-items: center;
  justify-content: center;
}
/* :::::::::::::: Required CSS */
/* Locked */
.lock {
  width: 24px;
  height: 21px;
  border: 3px solid var(--locked-color);
  border-radius: 5px;
  position: relative;
  cursor: pointer;
  -webkit-transition: all 0.1s ease-in-out;
  transition: all 0.1s ease-in-out;
}
.lock:after {
  content: "";
  display: block;
  background: var(--locked-color);
  width: 3px;
  height: 7px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -3.5px 0 0 -2px;
  -webkit-transition: all 0.1s ease-in-out;
  transition: all 0.1s ease-in-out;
}
.lock:before {
  content: "";
  display: block;
  width: 12px;
  height: 12px;
  bottom: 100%;
  position: absolute;
  left: 50%;
  margin-left: -6px;
  border: 3px solid var(--locked-color);
  border-top-right-radius: 50%;
  border-top-left-radius: 50%;
  border-bottom: 0;
  -webkit-transition: all 0.1s ease-in-out;
  transition: all 0.1s ease-in-out;
}
/* Locked Hover */
.lock:hover:before {
  height: 12px;
}
/* Unlocked */
.unlocked {
  transform: rotate(10deg);
}
.unlocked:before {
  bottom: 120%;
  left: 81%;
  margin-left: -11.5px;
  transform: rotate(45deg);
}
.unlocked,
.unlocked:before {
  border-color: var(--unlocked-color);
}
.unlocked:after {
  background: var(--unlocked-color);
}
/* Unlocked Hover */
.unlocked:hover {
  transform: rotate(3deg);
}
.unlocked:hover:before {
  height: 10px;
  left: 75%;
  bottom: 120%;
  transform: rotate(30deg);
}
</style>