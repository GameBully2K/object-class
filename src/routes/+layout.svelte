<script>
    import { LightSwitch } from '@skeletonlabs/skeleton';
</script>
<div class="announcement-bar bg-[#335C4C] text-white py-2 px-4 flex items-center justify-between">
    <div class="flex items-center">
        <svg class="h-5 w-5 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0zM9 5a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0V5zm0 7a1 1 0 0 1 2 0v1a1 1 0 0 1-2 0v-1z" clip-rule="evenodd"/>
        </svg>
        <span class="text-sm">This is a demo app made by <a class="font-bold" href="https://weblion.pro">Weblion</a>  found @ https://weblion.pro</span>
    </div>
</div>
<div class="flex justify-between  py-10">
    <div class="invisible md:visible "></div>
    <h1 class="h2 md:h1 font-bold px-10 md:px-0">OBJECT CLASSIFICATION APP</h1>
    <div class="justify-center items-center pt-2 px-4">
        <LightSwitch />
    </div>
</div>


<slot/>